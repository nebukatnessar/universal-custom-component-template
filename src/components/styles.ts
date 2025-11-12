export const employeeCardStyle: React.CSSProperties = {
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
  color: '#333',
};

export const nineGridCellStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', width: '100%' }

export const axisLabelStyle: React.CSSProperties = {
 textAlign: 'center', fontWeight: 'bold', fontSize: '1.1em'
};

export const potentialAxisLabelStyle: React.CSSProperties = { ...axisLabelStyle, writingMode: 'vertical-rl', marginRight: 8, display: 'flex', alignItems: 'center' }

export const employeeCardCellStyle: React.CSSProperties = {
  verticalAlign: 'top',
  width: '11%',
  height: '120px',
  padding: '4px',
  transition: 'background 0.2s'
};