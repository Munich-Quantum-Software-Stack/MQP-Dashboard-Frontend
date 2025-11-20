import React from 'react';
import { useSelector } from 'react-redux';
import ContentCard from 'src/components/UI/Card/ContentCard';
import FeedbackForm from 'src/components/Pages/Feedback/FeedbackForm';
import './Feedback.scss';

const Feedback = () => {
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 1.5;
  return (
    <React.Fragment>
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'} h-100`}>
        <div className="container_header_wrap">
          <h4 className="page_header" style={{ fontSize: page_header_fs }}>
            Feedback
          </h4>
        </div>

        <FeedbackForm />
      </ContentCard>
    </React.Fragment>
  );
};

export default Feedback;
