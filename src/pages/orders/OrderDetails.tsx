
import type { IParams } from "@/types/params.type";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams<IParams>();
  return (
    <>
      <div>
        <h1>this is OrderDetailsPage</h1>
        <p>{id}</p>
      </div>
    </>
  );
};

export default OrderDetails;
