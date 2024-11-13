import { DownloadOutlined } from "@ant-design/icons/lib/icons";
import { Transaction } from "@models";
import { Button, Card, Flex, Table, Tag, Typography } from "antd";
import { ColumnType } from "antd/es/table";
import { open } from '@tauri-apps/plugin-dialog';
import { useAppState } from "@hooks";

const { Text } = Typography;

export const Transactions: React.FC = () => {
  const { transactions, categories, importCsv } = useAppState();

  const columns: ColumnType<Transaction>[] = [
    {
      title: "Date",
      dataIndex: "date",
      width: "100px",
      render: (strDate: string) => new Date(strDate).toISOString().split('T')[0],
    },
    {
      title: "Summary",
      dataIndex: "summary",
      width: "300px",
    },
    {
      title: "Category",
      dataIndex: "summary",
      render: (summary: string) => {
        const category = categories.find(c => c.substrings.some(sub => summary.includes(sub)));
        if (category)
          return (<Tag color={category.color}>{category.name}</Tag>);
        else
          return (<></>);
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "150px",
      align: 'right',
      render: (amount: number, _item: Transaction) => {
        const type = amount < 0 ? 'danger' : 'success';
        return <Text type={type} strong>¥{Math.abs(amount)}</Text>;
      },
    },
  ];

  const importClicked = async () => {
    const selected = await open({
      multiple: true,
      filters: [{
        name: 'Bank receipts',
        extensions: ['csv']
      }]
    });

    if (Array.isArray(selected)) {
      selected.forEach(async (s) => await importCsv(s));
    } else if (selected === null) {
      // user cancelled the selection
    } else {
      await importCsv(selected);
    }
  };

  return (
    <Flex gap="middle" vertical>
      <Card bordered={false}>
        <Button type="primary" icon={<DownloadOutlined/>} onClick={importClicked}>
          Import
        </Button>
      </Card>
      <Card bordered={false} style={{flex: 1}}>
        <Table
          size={'small'}
          dataSource={transactions}
          columns={columns}
          scroll={{y: 400}}
          rowKey={t => t.externalId}/>
      </Card>
    </Flex>
  );
};
