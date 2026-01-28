import React, { startTransition, useOptimistic, useState } from "react";
const LikeButton = ({ postId, initializeLike = 0 }) => {
  const [likes, setLikes] = useState(initializeLike);
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (currentLikes) => currentLikes + 1,
  );
  async function sendLikeToServer(postId) {
    await new Promise((r) => setTimeout(r, 2000));
    console.log(postId);
    return { success: true, likes: likes + 1 };
  }
  const handleLike = async () => {
    addOptimisticLike();
    try {
      const res = await sendLikeToServer(postId);
      setLikes(res.likes);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button onClick={() => startTransition(async () => handleLike())}>
      {" "}
      &hearts;{optimisticLikes}{" "}
    </button>
  );
};
export default LikeButton;
