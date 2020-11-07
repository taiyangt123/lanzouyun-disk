import React, {useEffect, useState} from 'react'
import {ScrollView} from '../component/ScrollView'
import {Header} from '../component/Header'
import {Button} from '../component/Button'
import {Bar} from '../component/Bar'
import {Icon} from '../component/Icon'
import {byteToSize} from '../../common/util'
import {Table} from '../component/Table'
import upload, {UploadInfo} from '../store/Upload'
import {Modal} from '../component/Modal'
import {observer} from 'mobx-react'
import {message} from '../component/Message'

const Upload = observer(() => {
  const [showItem, setShowItem] = useState<UploadInfo>(null)

  useEffect(() => {
    const showError = msg => message.error(msg)
    upload.on('error', showError)
    return () => upload.removeListener('error', showError)
  }, [])

  return (
    <ScrollView
      HeaderComponent={
        <>
          <Header>
            <Button onClick={() => upload.pauseAll()}>全部暂停</Button>
            <Button onClick={() => upload.startAll()}>全部开始</Button>
            <Button onClick={() => upload.removeAll()}>全部删除</Button>
          </Header>
          <Bar>
            <span>正在上传</span>
          </Bar>
        </>
      }
    >
      <Table header={['文件名', '大小', '操作']}>
        {upload.list.map(item => {
          return (
            <tr key={item.path}>
              <td
                onClick={() => {
                  setShowItem(item)
                }}
              >
                <Icon iconName={'file'} />
                <span>{item.name}</span>
                {item.tasks.length > 1 && <span>{` | ${item.tasks.length} 个子任务`}</span>}
              </td>
              <td>{`${byteToSize(item.resolve)} / ${byteToSize(item.size)}`}</td>
              <td>{/*todo:操作*/}</td>
              <td></td>
            </tr>
          )
        })}
      </Table>

      <Modal visible={!!showItem}>
        <div className='dialog'>
          <ScrollView style={{maxHeight: 400, minHeight: 200, width: 600}}>
            {showItem?.tasks?.map(item => (
              <p key={item.name}>{`${item.name}  |  ${item.status}`}</p>
            ))}
          </ScrollView>
          <div style={{textAlign: 'right', paddingTop: 16}}>
            <Button onClick={() => setShowItem(null)}>取消</Button>
          </div>
        </div>
      </Modal>
    </ScrollView>
  )
})

export default Upload