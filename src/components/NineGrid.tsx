
import EmployeeCard from './EmployeeCard';
import React from 'react';
import { axisLabelStyle, employeeCardCellStyle, nineGridCellStyle, potentialAxisLabelStyle } from './styles';

export interface IEmployeePerformance {
  employee_id: number;
  year: number;
  potential: number;
  performance: number;
  manager_id: number;
  first_name: string;
  last_name: string;
  photo: {
    FileName: string;
    Url: string;
    PreviewUrl: string;
    PreviewContentType: string;
    PreviewSandboxMode: string;
  };
  transl_manager_id: {
    name: string;
  };
}


interface NineGridProps {
  employees: IEmployeePerformance[];
  currentEmployeeId?: number;
  onDrop?: (employee_id: number, year: number, performance: number, potential: number) => void;
}

// 9-grid is a 3x3 grid based on potential (y) and performance (x)
export const NineGrid: React.FC<NineGridProps> = ({ employees, currentEmployeeId, onDrop }) => {
  // Create a 3x3 array for grid cells
  const grid: IEmployeePerformance[][][] = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => []));

  // Place employees in the correct cell
  employees.forEach(emp => {
    // Clamp values to 1-3
    const perf = Math.max(1, Math.min(3, emp.performance));
    const pot = Math.max(1, Math.min(3, emp.potential));
    // Reverse potential axis: row 0 = potential 3, row 1 = potential 2, row 2 = potential 1
    grid[3 - pot][perf - 1].push(emp);
  });

  return (
    <div style={{ ...nineGridCellStyle, flexDirection: 'column'}}>
      <div style={{ ...nineGridCellStyle, flexDirection: 'row' }}>
        {/* Vertical axis label */}
        <div style={potentialAxisLabelStyle}>
          Potential
        </div>
        <div style={{ flex: 1 }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th colSpan={3} style={{ ...axisLabelStyle, padding: '8px 0' }}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {grid.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {/* Empty cell for axis spacing */}

                  {row.map((cell, colIdx) => {
                    // Fix: bottom left (rowIdx=2, colIdx=0) is most negative, top right (rowIdx=0, colIdx=2) is most positive
                    // Negative: bottom left, bottom center, center left
                    // Center: center, bottom right, top left
                    // Best: top center, center right, top right
                    let cellColor = '';
                    let borderColor = '';
                    if ((rowIdx === 2 && colIdx === 0) || (rowIdx === 2 && colIdx === 1) || (rowIdx === 1 && colIdx === 0)) {
                      cellColor = '#ffe5e5'; // pastel red
                      borderColor = '#d32f2f';
                    } else if ((rowIdx === 1 && colIdx === 1) || (rowIdx === 2 && colIdx === 2) || (rowIdx === 0 && colIdx === 0)) {
                      cellColor = '#fff9e5'; // pastel yellow
                      borderColor = '#fbc02d';
                    } else {
                      cellColor = '#e5f0ff'; // pastel blue
                      borderColor = '#1976d2';
                    }
                    const handleDrop = (e: React.DragEvent<HTMLTableCellElement>) => {
                      e.preventDefault();
                      const data = e.dataTransfer.getData('application/json');
                      try {
                        const { employee_id, year } = JSON.parse(data);
                        if (onDrop) {
                          // performance = colIdx+1, potential = 3-rowIdx
                          onDrop(employee_id, year, colIdx + 1, 3 - rowIdx);
                        }
                      } catch {}
                    };
                    const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
                      e.preventDefault();
                    };
                    return (
                      <td
                        key={colIdx}
                        style={{
                          ...employeeCardCellStyle,
                          border: `2px solid ${borderColor}`,
                          background: cellColor,
                        }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        {cell.map(emp => (
                          <EmployeeCard key={`${emp.employee_id}-${emp.year}`} employee={emp} isCurrent={emp.employee_id === currentEmployeeId} />
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};