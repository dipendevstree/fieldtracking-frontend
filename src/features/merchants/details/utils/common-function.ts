export const getStatusColor = (status: boolean) => {
  return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

export const getOnlineStatusColor = (isOnline: boolean) => {
  return isOnline ? 'bg-green-500' : 'bg-gray-400';
};


export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};


