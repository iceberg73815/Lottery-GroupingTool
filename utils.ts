
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const parseCSV = (csv: string): string[] => {
  return csv
    .split(/[,\n]/)
    .map(name => name.trim())
    .filter(name => name.length > 0);
};

export const parseTextList = (text: string): string[] => {
  return text
    .split('\n')
    .map(name => name.trim())
    .filter(name => name.length > 0);
};

export const getMockData = (): string[] => {
  return [
    "陈大明", "林美玲", "王小虎", "张志伟", "李淑芬", 
    "黄俊杰", "吴若雅", "蔡宗翰", "郑雅婷", "刘建宏"
  ];
};

export const downloadGroupsAsCSV = (groups: any[]) => {
  let csvContent = "data:text/csv;charset=utf-8,Team Name,Member Name\n";
  groups.forEach(group => {
    group.members.forEach((member: any) => {
      csvContent += `"${group.name}","${member.name}"\n`;
    });
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `group_results_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
