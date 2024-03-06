import React, { useState } from "react";
import { Card } from "antd";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import "./FaqItem.css";

const FaqItem = ({ title, children, id }) => {
  const [expanded, setExpanded] = useState(false);

  const showFaq = () => {
    const element = document.getElementById(id);
    if (!expanded) {
      element.style.height =
        Array.prototype.reduce.call(
          element.childNodes,
          function (p, c) {
            return p + (c.offsetHeight || 0);
          },
          0
        ) + "px";
    } else {
      element.style.height = "50px";
    }
    setExpanded(!expanded);
  };

  return (
    <Card
      className={`CollapsibleCard FaqCard ${
        expanded ? "expanded" : "collapsed"
      }`}
      bordered={false}
      onClick={showFaq}
      id={id}
      title={
        <div className="card-title-container">
          <span className="card-title-text">{title}</span>
          {expanded ? (
            <MdOutlineExpandLess
              className="dropdownIcon"
              style={{ color: "white" }}
            />
          ) : (
            <MdOutlineExpandMore
              className="dropdownIcon"
              style={{ color: "white" }}
            />
          )}
        </div>
      }
      headStyle={{ border: "none" }}
    >
      <div className="cardBody">{children}</div>
    </Card>
  );
};

export default FaqItem;
