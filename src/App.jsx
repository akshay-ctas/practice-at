import { useEffect, useState } from "react";
import Product from "./components/Product";
import axios from "axios";

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/posts")
      .then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-5">
        <Product products={products} />
      </div>
    </div>
  );
};

export default App;
