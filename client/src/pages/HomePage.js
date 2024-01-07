  import React, { useEffect, useState } from 'react'
  import { Form, Input, Modal, Select, Table, message, DatePicker } from 'antd'
  import Layout from '../components/Layout/Layout'
  import axios from 'axios'
  import Spinner from '../components/Spinner'
  import moment from 'moment'
  import {UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
  import Analytics from '../components/Analytics'

  const {RangePicker} = DatePicker;

  const HomePage = () => {

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allTransactions, setAllTransactions] = useState([]);
    const [frequency, setFrequency] = useState('7');
    const [selectedDate, setSelectedDate] = useState([]);
    const [type, setType] = useState('all');
    const [viewData, setViewData] = useState('table');
    const [editTable, setEditTable] = useState(null);

    //table data
    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
      },
      {
        title: 'Amount',
        dataIndex: 'amount'
      },
      {
        title: 'Type',
        dataIndex: 'type'
      },
      {
        title: 'Category',
        dataIndex: 'category'
      },
      {
        title: 'Reference',
        dataIndex: 'reference'
      },
      {
        title: 'Actions',
        render: (text, record) => (
          <div>
            <EditOutlined
            onClick={() => {
              setEditTable(record)
              setShowModal(true)
            }} 
            />
            <DeleteOutlined className='mx-2' onClick={() => {handleDelete(record)}}/>
          </div>
        )
      },
    ]

    useEffect(() => {
      const storedFrequency = localStorage.getItem('selectedFrequency');
      if (storedFrequency) {
        setFrequency(storedFrequency);
      }
        //get all transactions
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        setLoading(true)
        const res = await axios.post('https://expense-management-app-qou0.onrender.com/transactions/get-transaction', {
          userid: user._id,
          frequency,
          selectedDate,
          type
        });
        setAllTransactions(res.data)
        setLoading(false)
      
      } catch (error) {
        message.error("Something Went Wrong!")
      }
      
    }
      getAllTransactions();
    }, [frequency, selectedDate, type, setAllTransactions])

    //delete handler
    const handleDelete = async (record) => {
      try {
        setLoading(true)
        await axios.post('https://expense-management-app-qou0.onrender.com/transactions/delete-transaction', {
        transactionId: record._id
      })
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      message.success('Transaction Deleted')
      setLoading(false)
    } catch (error) {
        setLoading(false)
        console.log(error)
        message.error('Unable to Delete!')
      }
      
    }

    //form handling 
    const handleSubmit = async (values) => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        setLoading(true)
        if(editTable){
        await axios.post('https://expense-management-app-qou0.onrender.com/transactions/edit-transaction', {
          payload: {
            ...values,
            userId: user._id,
          },
          transactionId: editTable._id,
        })
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        message.success("Transaction Updated Successfully")
        setLoading(false)
        }
        else{
        await axios.post('https://expense-management-app-qou0.onrender.com/transactions/add-transaction', {...values, userid:user._id})
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        message.success("Transaction Added Successfully")
        setLoading(false)
        }
        setShowModal(false)
        setEditTable(null);
      } catch (error) {
        setLoading(false)
        message.error("Failed to Add Transaction!")
      }
      
    }
    const handleFrequencyChange = (values) => {
      setFrequency(values);
      localStorage.setItem('selectedFrequency', values);
    };

    return (
      <Layout>
        {loading && <Spinner />}
          <div className='filters'>
            <div>
              <h6>Select Frequency</h6>
              <Select value={frequency} onChange={handleFrequencyChange}>
                <Select.Option value='7'>Last 1 Week</Select.Option>
                <Select.Option value='30'>Last 1 Month</Select.Option>
                <Select.Option value='365'>Last 1 Year</Select.Option>
                <Select.Option value='custom'>Custom</Select.Option>
              </Select>
              {frequency === 'custom' && <RangePicker 
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}/>}
            </div>
            <div className='filter-tab'>
              <h6>Select Type</h6>
              <Select value={type} onChange={(values) => setType(values)}>
                <Select.Option value='all'>All</Select.Option>
                <Select.Option value='income'>Income</Select.Option>
                <Select.Option value='expense'>Expense</Select.Option>
              </Select>
              
            </div>
            <div className='switch-icons'>
                <UnorderedListOutlined 
                className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`} 
                onClick={() => setViewData('table')}/>
                <AreaChartOutlined 
                className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`}  
                onClick={() => setViewData('analytics')}/>
              </div>
            <div>
            <button className='btn btn-primary' onClick={() => setShowModal(true)}>Add New</button>
            </div>
          </div>
          <div className='content'>
            {viewData === 'table' ? (<Table columns={columns} dataSource={allTransactions}/>) 
            : (<Analytics allTransactions={allTransactions}/> 
            )}
          </div>
          <Modal title={editTable ? 'Edit Transaction' : 'Add Transaction'} open={showModal} 
          onCancel={() => setShowModal(false)} footer={false}>
            <Form layout='vertical' onFinish={handleSubmit} initialValues={editTable}>
              <Form.Item label='Amount' name='amount'>
                <Input type='text' required/>
              </Form.Item>
              <Form.Item label='Type' name='type'>
                <Select>
                  <Select.Option value='income'>Income</Select.Option>
                  <Select.Option value='expense'>Expense</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label='Category' name='category'>
                <Select>
                  <Select.Option value='salary'>Salary</Select.Option>
                  <Select.Option value='project'>Project</Select.Option>
                  <Select.Option value='food'>Food</Select.Option>
                  <Select.Option value='movie'>Movie</Select.Option>
                  <Select.Option value='bills'>Bills</Select.Option>
                  <Select.Option value='tax'>Tax</Select.Option>
                  <Select.Option value='medical'>Medical</Select.Option>
                  <Select.Option value='fee'>Fee</Select.Option>
                  <Select.Option value='others'>Others</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label='Date' name='date'>
                <Input type='date'/>
              </Form.Item>
              <Form.Item label='Reference' name='reference'>
                <Input type='text'/>
              </Form.Item>
              <Form.Item label='Description' name='description'>
                <Input type='text'/>
              </Form.Item>
              <div className='d-flex justify-content-end'>
                <button type='submit' className='btn btn-primary'>{" "}SAVE</button>
              </div>
            </Form>
          </Modal>
      </Layout>
    )
  }

  export default HomePage
