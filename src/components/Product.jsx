import axios from "axios";
import React, {
  startTransition,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";

const Product = ({ products }) => {
  //   const [likeMap, setLikeMap] = useState(
  //     Object.fromEntries(
  //       (products || []).map((p) => [p.id, { count: p.likes, liked: false }]),
  //     ),
  //   );

  //   const handleLikes = (id) => {
  //     // if (!likeMap[id] || likeMap[id].liked) return;
  //     console.log(likeMap[id]?.count);

  //     setLikeMap((prev) => ({
  //       ...prev,
  //       [id]: { count: prev[id].count + 1, liked: true },
  //     }));
  //     console.log(likeMap[id]?.count);
  //   };

  const [likeMap, setLikeMap] = useState({}); // initially empty
  const [optimisticLikeMap, addOptimisticLikeMap] = useOptimistic(
    likeMap,
    (currentMap, id) => ({
      ...currentMap,
      [id]: {
        count: currentMap[id].count + 1,
        liked: true,
      },
    }),
  );

  useEffect(() => {
    if (!products || products.length === 0) return;
    startTransition(() => {
      const map = Object.fromEntries(
        products.map((p) => [p.id, { count: p.likes, liked: false }]),
      );
      setLikeMap(map);
    });
  }, [products]);

  const handleLikes = async (id) => {
    if (optimisticLikeMap[id].liked) return;
    // if (likeMap[id].liked) return;

    addOptimisticLikeMap(id);

    setLikeMap((prev) => ({
      ...prev,
      [id]: { count: prev[id].count + 1, liked: true },
    }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 10000));

      await axios.patch(`http://localhost:3001/posts/${id}`, {
        likes: likeMap[id].count + 1,
      });
    } catch (error) {
      console.log(error);

      setLikeMap((prev) => ({
        ...prev,
        [id]: { count: prev[id].count - 1, liked: true },
      }));
    }
  };

  if (!products || products.length === 0) return <p>Loading...</p>;

  if (!products || products.length === 0) return <p>Loading...</p>;
  return (
    <div className="grid grid-cols-4 gap-5">
      {products.map((product) => (
        <div className=" bg-white flex flex-col p-3 rounded" key={product.id}>
          <h1 className="text-xl font-bold">{product.title}</h1>
          <p className="line-clamp-4 text-slate-500 text-sm">
            {product.content}
          </p>
          <span className="flex gap-2">
            {likeMap[product.id]?.liked === true ? (
              <FcLike
                onClick={() =>
                  startTransition(async () => handleLikes(product.id))
                }
                className="h-5 w-5"
              />
            ) : (
              <FcLikePlaceholder
                onClick={() =>
                  startTransition(async () => handleLikes(product.id))
                }
                className="h-5 w-5"
              />
            )}
            {optimisticLikeMap[product.id]?.count}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Product;
