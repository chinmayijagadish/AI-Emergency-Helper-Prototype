
import React from 'react';
import { FirstAidResponse, SeverityLevel } from '../types';
import { AlertTriangle, CheckCircle2, ShieldAlert, Ban, PhoneCall, Info } from 'lucide-react';

interface ResponseCardProps {
  data: FirstAidResponse;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ data }) => {
  const getSeverityStyles = (level: SeverityLevel) => {
    switch (level) {
      case SeverityLevel.HIGH:
        return 'bg-red-100 text-red-700 border-red-200';
      case SeverityLevel.MEDIUM:
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case SeverityLevel.LOW:
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`p-4 rounded-xl border flex items-center justify-between ${getSeverityStyles(data.severityLevel)}`}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-wider">Severity: {data.severityLevel}</span>
        </div>
        {data.severityLevel === SeverityLevel.HIGH && (
          <span className="text-xs font-semibold animate-pulse">ACTION REQUIRED NOW</span>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-gray-800">
          <Info className="w-5 h-5 text-blue-500" />
          🚨 Situation
        </h2>
        <p className="text-gray-600 leading-relaxed">{data.situation}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          ✅ Immediate Steps
        </h2>
        <ol className="space-y-3">
          {data.immediateSteps.map((step, idx) => (
            <li key={idx} className="flex gap-4 items-start text-gray-700">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
            <ShieldAlert className="w-5 h-5 text-yellow-500" />
            ⚠️ Safety Tips
          </h2>
          <ul className="space-y-2">
            {data.safetyTips.map((tip, idx) => (
              <li key={idx} className="flex gap-2 items-start text-gray-600 text-sm italic">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
            <Ban className="w-5 h-5 text-red-500" />
            ❌ Avoid
          </h2>
          <ul className="space-y-2">
            {data.avoid.map((item, idx) => (
              <li key={idx} className="flex gap-2 items-start text-gray-600 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-800">
          <PhoneCall className="w-5 h-5 text-red-600" />
          📞 When to Call Emergency
        </h2>
        <ul className="space-y-2">
          {data.whenToCallEmergency.map((condition, idx) => (
            <li key={idx} className="flex gap-2 items-start text-red-700 font-medium">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
              {condition}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-center text-xs text-gray-400 py-4 italic">
        "This guidance is for first aid support only and does not replace professional medical care."
      </p>
    </div>
  );
};

export default ResponseCard;
