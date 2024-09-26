import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { saveComment, getEventLogs, deleteComment } from "@/lib/employee/actions"; // Assume deleteComment is a function in your API
import toast from "react-hot-toast";

export default function Comments({ eventLogs, item, token, ocpKey }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newEventLogs, setNewEventLogs] = useState<any | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, commentId: null });

  const renderComments = (logs: any) =>
    logs?.map((log: any) => {
      const { id, value, createdOn, modifiedBy } = log;
      const formattedDate = new Date(createdOn).toLocaleDateString("en-GB");

      return (
        <div key={id} className="mb-4 p-4 bg-gray-100 shadow-md rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">{formattedDate}</span>
            <div className="text-right flex items-center justify-center gap-2">
              <p className="text-sm text-gray-700">{modifiedBy}</p>
              <X className="text-red-500 cursor-pointer" onClick={() => setDeleteConfirmation({ isOpen: true, commentId: id })} />
            </div>
          </div>
          <p className="text-lg text-gray-900">{value}</p>
        </div>
      );
    });

  const handleSaveComment = async () => {
    let response = await saveComment(item.id, item.name, newComment, token, ocpKey);
    if (response) {
      toast.success("Comment saved successfully!");
      setIsModalOpen(false);
      setNewComment("");
      let eventLogs = await getEventLogs(item.id, token, ocpKey);
      setNewEventLogs(eventLogs);
    } else {
      toast.error("Error saving comment!");
    }
  };

  const handleDeleteComment = async () => {
    if (deleteConfirmation.commentId !== null) {
      const response = await deleteComment(deleteConfirmation.commentId, token, ocpKey);
      if (response) {
        toast.success("Comment deleted successfully!");
        let eventLogs = await getEventLogs(item.id, token, ocpKey);
        setNewEventLogs(eventLogs);
      } else {
        toast.error("Error deleting comment!");
      }
      setDeleteConfirmation({ isOpen: false, commentId: null });
    }
  };

  const hasComments = newEventLogs?.length > 0 || eventLogs?.length > 0;

  return (
    <div className="max-w- mx-auto mt-4 bg-white p-4 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center flex-grow">Comments ({newEventLogs !== null ? newEventLogs?.length : eventLogs?.length})</h2>
        <Plus className="text-gray-500 cursor-pointer" onClick={() => setIsModalOpen(true)} />
      </div>

      <div className="overflow-y-auto max-h-56 scroll-smooth p-2">
        {hasComments ? newEventLogs !== null ? renderComments(newEventLogs) : renderComments(eventLogs) : <p className="text-center text-gray-500">No comments yet</p>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Comment</h2>
            <textarea className="w-full h-32 p-2 border border-gray-300 rounded-lg" placeholder="Write your comment here..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleSaveComment}>
                Save Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this comment?</p>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2" onClick={() => setDeleteConfirmation({ isOpen: false, commentId: null })}>
                Cancel
              </button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleDeleteComment}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
