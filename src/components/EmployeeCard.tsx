import { parentStartProcessFlow } from './App';
import React from 'react';
import { IEmployeePerformance } from './NineGrid';
import { employeeCardStyle } from './styles';

// Card for displaying an employee name
interface EmployeeCardProps {
  employee: IEmployeePerformance;
  isCurrent?: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, isCurrent }) => {
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

  const currentStyle = isCurrent ? { border: '2px solid #1976d2' } : {};

  return (
    <div
      key={employee.employee_id}
      style={{ ...employeeCardStyle, ...currentStyle }}
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
