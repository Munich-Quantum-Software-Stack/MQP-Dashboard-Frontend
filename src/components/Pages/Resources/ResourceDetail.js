import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlankCard from '../../UI/Card/BlankCard';
import Button from '../../UI/Button/Button';

const ResourceDetail = () => {
  const params = useParams();
  //console.log(params);
  const navigate = useNavigate();
  const backToHandler = () => {
    navigate('..');
  };
  return (
    <BlankCard>
      <h1>Resource Detail of {params.resourceId}</h1>
      <div className="resource_detail_actions mt-5">
        <Button className="resource_detail_btn back_btn" onClick={backToHandler}>
          &lt;&lt; Back
        </Button>
      </div>
    </BlankCard>
  );
};

export default ResourceDetail;
