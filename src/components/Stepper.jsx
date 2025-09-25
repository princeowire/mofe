import { CheckCircleIcon } from "./Icons";

export default function Stepper({ steps, currentStep }) {
  return (
    <div className="mb-8 flex items-center justify-center w-full relative">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1 justify-between">
          
          <div className="flex flex-col items-center">

            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              index <= currentStep ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-500'
            }`}>
              {index < currentStep ? <CheckCircleIcon className="w-5 h-5" /> : <span>{index + 1}</span>}
            </div>

            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>

          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-4 ${index < currentStep ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
}
