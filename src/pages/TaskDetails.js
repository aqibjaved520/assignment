import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";

const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [status, setStatus] = useState("");

  const fetchTaskDetails = async () => {
    const taskDoc = await getDoc(doc(db, "tasks", taskId));
    if (taskDoc.exists()) {
      setTask({ id: taskDoc.id, ...taskDoc.data() });
      setStatus(taskDoc.data().status);
    }
  };

  const fetchComments = async () => {
    const commentsQuery = query(
      collection(db, "comments"),
      where("taskId", "==", taskId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    setComments(
      commentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addDoc(collection(db, "comments"), {
        taskId,
        text: newComment,
        author: "currentUser@example.com", 
        createdAt: new Date(),
      });
      setNewComment("");
      fetchComments();
    }
  };

  const handleStatusUpdate = async () => {
    await updateDoc(doc(db, "tasks", taskId), { status });
    fetchTaskDetails();
  };

  useEffect(() => {
    fetchTaskDetails();
    fetchComments();
  }, []);

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <h1>Task Details</h1>
      <p><strong>Author:</strong> {task.author}</p>
      <p><strong>Created At:</strong> {new Date(task.createdAt?.seconds * 1000).toLocaleString()}</p>
      <p><strong>Status:</strong></p>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <button onClick={handleStatusUpdate}>Update Status</button>

      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p><strong>{comment.author}:</strong> {comment.text}</p>
            <p><em>{new Date(comment.createdAt?.seconds * 1000).toLocaleString()}</em></p>
          </li>
        ))}
      </ul>
      <textarea
        placeholder="Add a comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      ></textarea>
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
};

export default TaskDetails;