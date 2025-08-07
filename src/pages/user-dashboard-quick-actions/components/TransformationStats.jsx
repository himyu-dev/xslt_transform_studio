import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const TransformationStats = () => {
  const monthlyData = [
    { month: 'Jan', transformations: 45 },
    { month: 'Feb', transformations: 52 },
    { month: 'Mar', transformations: 38 },
    { month: 'Apr', transformations: 61 },
    { month: 'May', transformations: 55 },
    { month: 'Jun', transformations: 67 },
    { month: 'Jul', transformations: 73 },
    { month: 'Aug', transformations: 42 }
  ];

  const formatData = [
    { name: 'JSON to XML', value: 45, color: '#2563EB' },
    { name: 'XML to JSON', value: 35, color: '#0EA5E9' },
    { name: 'JSON to JSON', value: 15, color: '#059669' },
    { name: 'XML to XML', value: 5, color: '#D97706' }
  ];

  const stats = [
    {
      label: 'Total Projects',
      value: '247',
      change: '+12%',
      changeType: 'positive',
      icon: 'FileText'
    },
    {
      label: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'CheckCircle'
    },
    {
      label: 'Avg. Processing Time',
      value: '1.3s',
      change: '-0.2s',
      changeType: 'positive',
      icon: 'Clock'
    },
    {
      label: 'Active Templates',
      value: '18',
      change: '+3',
      changeType: 'positive',
      icon: 'Template'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Transformation Statistics</h2>
        <div className="flex items-center gap-2">
          <select className="text-sm border border-border rounded px-2 py-1 bg-background">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats?.map((stat, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name={stat?.icon} size={20} className="text-primary" />
              <span className={`text-xs font-medium ${
                stat?.changeType === 'positive' ? 'text-success' : 'text-error'
              }`}>
                {stat?.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stat?.value}</div>
            <div className="text-sm text-muted-foreground">{stat?.label}</div>
          </div>
        ))}
      </div>
      {/* Monthly Transformations Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Monthly Transformations</h3>
        <div className="w-full h-32" aria-label="Monthly Transformations Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B' }}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="transformations" fill="#2563EB" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Format Distribution */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Format Distribution</h3>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
                  dataKey="value"
                >
                  {formatData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1">
            <div className="space-y-2">
              {formatData?.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item?.color }}
                    />
                    <span className="text-muted-foreground">{item?.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item?.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformationStats;