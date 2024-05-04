import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons/lib/icons";
import { Table, Tag } from "antd";
import { Kind, Transaction } from "src/slices/transactionsSlice";

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    width: "100px",
    render: (date: Date) =>
      `${date.getFullYear()}/${"0" + date.getMonth().toString().slice(-2)}/${
        "0" + date.getDay().toString().slice(-2)
      }`,
  },
  {
    title: "Kind",
    dataIndex: "kind",
    width: "50px",
    render: (kind: Kind) =>
      kind === "expense" ? (
        <CaretDownFilled style={{ color: "red" }} />
      ) : (
        <CaretUpFilled style={{ color: "green" }} />
      ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: "50px",
  },
  {
    title: "Category",
    dataIndex: "categoryId",
    width: "100px",
    render: (category: string) => <Tag color="green">{category}</Tag>,
  },
  {
    title: "Summary",
    dataIndex: "summary",
  },
];
const Transactions: React.FC = () => {
  const dataSource: Transaction[] = [
    {
      id: "1",
      bank: "Rakuten",
      externalId: "externalId",
      date: new Date(),
      kind: "expense",
      amount: 498,
      categoryId: "food",
      summary: "Uber Eats",
    },
    {
      id: "2",
      bank: "Rakuten",
      externalId: "externalId",
      date: new Date(),
      kind: "expense",
      amount: 123,
      categoryId: "food",
      summary: "Seijo Ishii",
    },
  ];

  return <Table dataSource={dataSource as any} columns={columns} />;
};

export default Transactions;
