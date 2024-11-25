import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Skeleton } from "antd";

//css imports
import "./ProductList.scss";

const ProductList = () => {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [data, setdata] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(page, "");
  }, []);

  const fetchProducts = (page, type) => {
    setLoading(true);
    let pageData = type === "prev" ? page - 1 : page + 1;
    try {
      fetch(
        `https://dummyjson.com/products?limit=10&skip=${
          pageData === 1 ? 0 : (pageData - 1) * 10
        }`
      )
        .then((res) => res.json())
        .then((response) => {
          setTotal(response?.total);
          setdata(response?.products);
        });
      setPage(pageData);
    } catch (e) {
      message.error("Something went wrong");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <React.Fragment>
      <div className="header">
        <div className="content">Products</div>
        <div className="sub_content_div">
          <div className="sub_content">
            A List of Products available along with their details i.e. title,
            price and product image
          </div>
        </div>
      </div>
      <div className="product_container">
        {loading ? (
          <Skeleton paragraph={{ rows: 18 }} active />
        ) : (
          <div>
            {data?.map((product, index) => {
              return (
                <div
                  className="product_body"
                  key={product?.id}
                  onClick={() => navigate(`product/${product?.id}`)}
                >
                  <div className="product_details">
                    <div className="content">
                      <div className="title_div">
                        <div className="title">
                          {product?.id}. {product?.title}
                        </div>
                      </div>
                    </div>
                    <div className="content_des">Price Rs-{product?.price}</div>
                  </div>
                  <div className="image_div">
                    <img src={product?.thumbnail} alt="product" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {!loading && (
        <div className="footer">
          <div className="footer_child">
            <p className="pagination_info">
              {`Showing ${(page - 1) * 10 + 1} - ${Math.min(
                page * 10,
                total
              )} of ${total} products`}
            </p>
            <button
              disabled={page === 1}
              onClick={() => fetchProducts(page, "prev")}
            >
              Back
            </button>
            <button
              disabled={page === Math.ceil(total / 10)}
              onClick={() => fetchProducts(page, "next")}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
export default ProductList;
