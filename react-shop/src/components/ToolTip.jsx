import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function ToolTip({ product }) {
    return (                
    <OverlayTrigger
        placement="top"
        overlay={<Tooltip>{product}</Tooltip>}
      >
        <h5
          className="card-title truncate-text"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
        >
          {product}
        </h5>
      </OverlayTrigger>
    )
}

export default ToolTip;