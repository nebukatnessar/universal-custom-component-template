import { parentStartProcessFlow } from './App';
import React from 'react';
import { IEmployeePerformance } from './NineGrid';

// Card for displaying an employee name
interface EmployeeCardProps {
  employee: IEmployeePerformance;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const handleClick = () => {
    parentStartProcessFlow('employee_performance_set_row', {
      employee_id: employee.employee_id,
      year: employee.year,
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      employee_id: employee.employee_id,
      year: employee.year,
    }));
  };

  return (
    <div
      key={employee.employee_id}
      style={{
        marginBottom: '8px',
        background: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        padding: '8px 12px',
        display: 'inline-block',
        minWidth: '100px',
        textAlign: 'center',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={handleClick}
      title={`Start process for ${employee.first_name} ${employee.last_name}`}
      draggable
      onDragStart={handleDragStart}
    >
      <span style={{ fontWeight: 500 }}>{employee.first_name} {employee.last_name}</span>
    </div>
  );
};

export default EmployeeCard;
