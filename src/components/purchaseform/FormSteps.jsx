import React from 'react';
    import { User, Truck, ShoppingCart, Check } from 'lucide-react';
    import { motion } from 'framer-motion';

    const FormSteps = ({ currentStep }) => {
      const stepsConfig = [
        { id: 1, name: 'Ihre Daten', icon: User },
        { id: 2, name: 'Abgabe & Zahlung', icon: Truck },
      ];
      
      const totalDisplaySteps = stepsConfig.length;

      return (
        <nav aria-label="Fortschritt" className="mb-12 px-2 md:px-0">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-slate-200 dark:bg-slate-700" aria-hidden="true">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep -1) / (totalDisplaySteps -1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            <ol role="list" className="relative flex items-center justify-between">
              {stepsConfig.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <li key={step.name} className="flex flex-col items-center text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.7 }}
                      animate={{ scale: isActive || isCompleted ? 1 : 0.9, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2
                        ${isCompleted ? 'border-primary bg-primary text-white' : ''}
                        ${isActive ? 'border-primary bg-primary/10 text-primary' : ''}
                        ${!isCompleted && !isActive ? 'border-slate-300 dark:border-slate-600 bg-background' : ''}
                      `}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : <step.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />}
                    </motion.div>
                    <p className={`mt-2 text-xs sm:text-sm font-medium 
                      ${isCompleted ? 'text-primary' : ''}
                      ${isActive ? 'text-primary' : ''}
                      ${!isCompleted && !isActive ? 'text-muted-foreground' : ''}
                    `}>
                      {step.name}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>
      );
    };

    export default FormSteps;