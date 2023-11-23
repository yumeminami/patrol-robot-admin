// StepForm.js
import React, { Component, useState } from 'react';
import { Card, Steps } from 'antd';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';

const { Step } = Steps;

const StepForm = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});

  const nextStep = () => {
    if (current < 2) {
      setCurrent(current + 1);
    }
  };

  const prevStep = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const finish = () => {
    setCurrent(0);
  };

  const updateFormData = (values) => {
    setFormData({ ...formData, ...values });
  };

  const successPage = () => {
    setCurrent(3);
  }

  const failPage = () => {
    setCurrent(4);
  }

  return (
    <Card bordered={false} >
      <Steps className="steps" current={current} size='small' >
        <Step title="First" size="small" />
        <Step title="Second" size="small" />
        <Step title="Complete" size="small" />
      </Steps>
      <div className="content">
        {current === 0 && <Step1 nextStep={nextStep} updateFormData={updateFormData}></Step1>}
        {current === 1 && <Step2 successPage={successPage} failPage={failPage} prevStep={prevStep} updateFormData={updateFormData} formData={formData}></Step2>}
        {current === 3 && <Step3 prevStep={prevStep} finish={finish} />}
        {current === 4 && <Step4 prevStep={prevStep} finish={finish} />}
      </div>
    </Card>
  );
};

export default StepForm;