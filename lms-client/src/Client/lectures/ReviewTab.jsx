// ReviewTab.js
import React from "react";
import ReviewSection from "../Courses/ReviewSection";

const ReviewTab = ({ reviews }) => {
  return (
    <div className="">
      <div className="overflow-hidden">
        <ReviewSection reviews={reviews} />
      </div>
    </div>
  );
};

export default ReviewTab;