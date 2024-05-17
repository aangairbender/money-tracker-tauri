import { Card, Col, Row } from "antd";

const Dashboard: React.FC = () => {
    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card bordered={false}>Widget1</Card>
            </Col>
            <Col span={8}>
                <Card bordered={false}>Widget2</Card>
            </Col>
            <Col span={8}>
                <Card bordered={false}>Widget3</Card>
            </Col>
        </Row>
    )
};

export default Dashboard;
