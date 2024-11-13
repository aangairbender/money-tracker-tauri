import { PlusOutlined } from "@ant-design/icons";
import { useAppState } from "@hooks";
import { Category } from "@models";
import { Avatar, Button, Card, ColorPicker, Flex, Input, List, Modal, Popconfirm, PopconfirmProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export const Categories: React.FC = () => {
  const { categories, upsertCategory, deleteCategory } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);

  const showModal = (target: Category) => {
    setEditedCategory(target);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    upsertCategory(editedCategory!);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditedCategory(null);
  };

  const addClicked = () => {
    const newCategory: Category = {
      id: uuidv4(),
      name: "New category",
      color: "gray",
      substrings: [],
    };
    showModal(newCategory);
  };

  return (
    <Flex gap="middle" vertical>
      <Card bordered={false}>
        <Button type="primary" icon={<PlusOutlined/>} onClick={addClicked}>
          Add
        </Button>
      </Card>
      <Card bordered={false}>
        <List
          itemLayout="horizontal"
          dataSource={categories}
          renderItem={(item) => {
            const deleteConfirm: PopconfirmProps['onConfirm'] = () => {
              deleteCategory(item);
            };
          
            const DeleteButton = () => (<Popconfirm
              title="Delete the category"
              description="Are you sure to delete this category?"
              onConfirm={deleteConfirm}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button danger>Delete</Button>
            </Popconfirm>);

            return (
              <List.Item
                actions={[<a key="edit" onClick={() => showModal(item)}>Edit</a>, <DeleteButton/>]}>
                <List.Item.Meta
                    key={item.id}
                    avatar={<Avatar style={{backgroundColor: item.color}}/>}
                    title={item.name}
                  />
              </List.Item>
            );
          }}
        />
      </Card>
      <Modal title="Edit category" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {editedCategory && (<Card>
          <Flex>
            <ColorPicker value={editedCategory.color} onChange={e => setEditedCategory({...editedCategory, color: e.toHexString()})} />
            <Input value={editedCategory.name} onChange={e => setEditedCategory({...editedCategory, name: e.target.value})}/>
          </Flex>
          <TextArea rows={10} value={editedCategory.substrings.join('\n')} onChange={e => setEditedCategory({...editedCategory, substrings: e.target.value.split('\n')})}/>
        </Card>)}
      </Modal>
    </Flex>
  );
};
