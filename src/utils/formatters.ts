export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(amount).replace('TWD', '$');
};

export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateDisplay = (dateString: string): string => {
  const today = new Date();
  const target = new Date(dateString);

  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (dateString === todayStr) {
    return '今天 · ' + (target.getMonth() + 1) + '月' + target.getDate() + '日';
  } else if (dateString === yesterdayStr) {
    return '昨天 · ' + (target.getMonth() + 1) + '月' + target.getDate() + '日';
  } else {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return `${target.getMonth() + 1}月${target.getDate()}日 · 週${days[target.getDay()]}`;
  }
};
