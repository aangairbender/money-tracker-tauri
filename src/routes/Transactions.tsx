import { Table } from "antd";

const columns = [
  {
    title: "Date",
    dataIndex: "date"
  },
  {
    title: "Kind",
    dataIndex: "kind"
  },
  {
    title: "Amount",
    dataIndex: "amount"
  },
  {
    title: "Category",
    dataIndex: "categoryId"
  },
  {
    title: "Summary",
    dataIndex: "summary"
  },
];

const Transactions: React.FC = () => {
  const dataSource = [
    {
      'date': '2023/06/02',
      'kind': 'expense',
      'amount': 498,
      'categoryId': 'food',
      'summary': 'Uber Eats'
    },
    {
      'date': '2023/06/01',
      'kind': 'expense',
      'amount': 123,
      'categoryId': 'food',
      'summary': 'Seijo Ishii'
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default Transactions;
