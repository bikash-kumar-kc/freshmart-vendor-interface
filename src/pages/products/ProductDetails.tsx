import type { IParams } from "@/types/params.type";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const {id} = useParams<IParams>();
  return <div>{id}</div>;
};

export default ProductDetails;
