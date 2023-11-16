import React, { useState } from 'react';
import { Card, Steps } from 'antd';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

const { Step } = Steps;

const StepForm = () => {
  const [current, setCurrent] = useState(0);

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

  return (
    <Card bordered={false} >
      <Steps className="steps" current={current} size='small' >
        <Step title="Input" size="small"/>
        <Step title="Confirm" size="small"/>
        <Step title="Complete" size="small"/>
      </Steps>
      <div className="content">
        {current === 0 && <Step1 nextStep={nextStep} />}
        {current === 1 && <Step2 nextStep={nextStep} prevStep={prevStep} />}
        {current === 2 && <Step3 prevStep={prevStep} finish={finish} />}
      </div>
    </Card>
  );
};

export default StepForm;
