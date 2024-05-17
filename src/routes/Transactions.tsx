import { CaretDownFilled, CaretUpFilled, DownloadOutlined, UploadOutlined } from "@ant-design/icons/lib/icons";
import { Transaction, TransactionKind } from "@models";
import { Button, Card, Flex, Space, Table, Tag, Typography } from "antd";
import { ColumnType } from "antd/es/table";

const { Text } = Typography;

const columns: ColumnType<Transaction>[] = [
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
    title: "Summary",
    dataIndex: "summary",
  },
  {
    title: "Category",
    dataIndex: "categoryId",
    width: "100px",
    render: (category: string) => <Tag color="green">{category}</Tag>,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: "50px",
    align: 'right',
    render: (amount: number, item: Transaction) => {
      const type = item.kind === 'expense' ? 'danger' : 'success';
      return <Text type={type} strong>¥{amount}</Text>;
    },
  },
];
const Transactions: React.FC = () => {
  const dataSource: Transaction[] = [
    {
      bank: "Rakuten",
      externalId: "externalId",
      date: new Date(),
      kind: "expense",
      amount: 498,
      categoryId: "food",
      summary: "Uber Eats",
    },
    {
      bank: "Rakuten",
      externalId: "externalId",
      date: new Date(),
      kind: "expense",
      amount: 123,
      categoryId: "food",
      summary: "Seijo Ishii",
    },
  ];

  return (
    <Flex gap="middle" vertical>
      <Card bordered={false}>
        <Button type="primary" icon={<DownloadOutlined/>}>
          Import
        </Button>
      </Card>
      <Card bordered={false}>
        <Table
          size={'small'}
          dataSource={dataSource}
          columns={columns} />
      </Card>
    </Flex>
  );
};

export default Transactions;
