import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { message, Skeleton } from "antd";

//css imports
import "./ProductDetail.scss";

const ProductDetail = () => {
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      try {
        fetch(`https://dummyjson.com/products/${id}`)
          .then((res) => res.json())
          .then((response) => setProductData(response));
      } catch (e) {
        message.error("Something went wrong");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    }
  }, [id]);

  console.log(id);
  return (
    <React.Fragment>
      <div className="header_detail">
        <div className="content">Details for Product-{id}</div>
        <div className="sub_content_div_detail">
          <div className="sub_content">
            A detailed information of the product which includes Product Id,
            Product image,title,description and much more!!
          </div>
          <button onClick={() => navigate("/")}>Back to Products</button>
        </div>
      </div>
      <div className="product_detail_body">
        {loading ? (
          <Skeleton paragraph={{ rows: 10 }} active />
        ) : (
          <React.Fragment>
            <div className="img_container">
              <img src={productData?.thumbnail} alt="img" />
            </div>
            <div className="product_content">
              <div className="content_div">
                <p>Product Name-</p>
                <p>{productData?.title}</p>
              </div>
              <div className="content_div">
                <p>Product Description-</p>
                <p>{productData?.description}</p>
              </div>
              <div className="content_div">
                <p>Product Price-</p>
                <p>{`Rs. ${productData?.price || 0}`}</p>
              </div>
              <div className="content_div">
                <p>Discount Percentage-</p>
                <p>{`${productData?.discountPercentage || 0} %`}</p>
              </div>
              <div className="content_div">
                <p>Rating</p>
                <p>{productData?.rating || ""}</p>
              </div>
              <div className="content_div">
                <p>Brand</p>
                <p>{productData?.brand || ""}</p>
              </div>
              <div className="content_div">
                <p>Category</p>
                <p style={{ textTransform: "capitalize" }}>
                  {productData?.category || ""}
                </p>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};
export default ProductDetail;
