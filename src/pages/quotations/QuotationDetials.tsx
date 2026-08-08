import type { IParams } from "@/types/params.type";
import { useParams } from "react-router-dom";

const QuotationDetials = () => {
  const { id } = useParams<IParams>();
  return (
    <div>
      <h1>this is quotation detials page</h1>
      <p>{id}</p>
    </div>
  );
};

export default QuotationDetials;
