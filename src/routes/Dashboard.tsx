import { useAppState } from "@hooks/useAppState";
import { BarChart } from "@tremor/react";
import { Card, Col, Row } from "antd";

const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

interface YearExpensesProps {
    year: number;
}

const YearExpenses: React.FC<YearExpensesProps> = (props) => {
    const { transactions } = useAppState();
    const expensesPerMonth: number[] = new Array(12).fill(0);
    const incomePerMonth: number[] = new Array(12).fill(0);
    transactions.forEach(t => {
        const date = new Date(t.date);
        if (date.getFullYear() !== props.year) return;
        if (t.amount < 0) {
            expensesPerMonth[date.getMonth()] -= t.amount;
        } else {
            incomePerMonth[date.getMonth()] += t.amount;
        }
    });

    const chartData = expensesPerMonth.map((e, i) => ({
        month: months[i],
        expense: e,
        income: incomePerMonth[i],
    }));

    console.log(chartData);

    return (
        <BarChart
            data={chartData}
            index="month"
            categories={['expense', 'income']}
            colors={['red', 'green']}
            yAxisWidth={16}
        />
    );
};

const Dashboard: React.FC = () => {
    return (
        <Row gutter={16}>
            <Col span={12}>
                <Card bordered={false} title="Current year">
                    <YearExpenses year={new Date().getFullYear()}/>
                </Card>
            </Col>
            <Col span={12}>
                <Card bordered={false} title="Last year">
                    <YearExpenses year={new Date().getFullYear() - 1}/>
                </Card>
            </Col>
        </Row>
    )
};

export default Dashboard;
