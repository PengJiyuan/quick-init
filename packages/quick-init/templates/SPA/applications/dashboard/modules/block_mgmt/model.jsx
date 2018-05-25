import './style/index.less';

import React from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'antd';
import {Main, ModalAlert, history} from 'ufec';
import config from './config.json';
import request from './request';
import create from './pop/create/index';
import createSnapshot from './pop/create_snapshot/index';
import timeUtil from '../../utils/time_format';
import unit from '../../utils/unit';
import changeSize from './pop/change_size/index';
import rollback from './pop/rollback/index';
import deleteModal from './pop/delete/index';
import deleteSnapshot from '../snapshot_mgmt/pop/delete/index';
import getErrorMessage from '../../utils/error_message';
// detail
import Properties from 'client/components/basic_props/index';
import DetailTable from 'client/components/detail_table/index';

class Model extends React.Component {

  constructor(props) {
    super(props);

    const iscsiInititalized = (GAREN.rbd && GAREN.rbd === 'initialized') ?
      true : false;

    // iscsi 未初始化，从下拉框中删掉 iscsi 选项
    // 这部分代码依赖于 config 里下拉框 pool type 的顺序，如果出了问题请及时检查这里还有快照那里
    if (!iscsiInititalized && config.operations[0].data[0].value === 'iscsi') {
      config.operations[0].data.shift();
    }

    this.state = {
      config: config,
      pools: [],
      currentPoolType: iscsiInititalized ? 'iscsi' : 'cloud',
      currentPool: '',
      page: 1,
      detailTableBtnLoading: {}
    };

    ['onInitialize', 'onAction', 'refresh'].forEach(func => {
      this[func] = this[func].bind(this);
    });
    this.tableColRender(this.state.config.table.columns);
  }

  tableColRender(columns) {
    const __ = this.props.__;
    columns.map((column) => {
      switch (column.dataIndex) {
        case 'allocate_capacity':
          column.render = (text, row, index) => {
            return unit.bytesToGB(row.size) + 'GB';
          };
          break;
        case 'volume_type':
          column.render = (text, row, index) => {
            return row.parent ? __.cloned_volume : __.independent_volume;
          };
          break;
        case 'parent_snapshot':
          column.render = (text, row, index) => {
            return row.parent ? <a data-type="router" href={`/snapshot_mgmt/${row.parent.snapshot}`}>{row.parent.snapshot}</a> : __.not_available;
          };
          break;
        case 'snapshot_numbers':
          column.render = (text, row, index) => {
            return row.snaps.length;
          };
          break;
        case 'created_at':
          column.render = (text, row, index) => {
            return timeUtil(row.create_timestamp);
          };
          break;
        default:
          break;
      }
    });
  }

  onInitialize() {
    const path = history.getPathList();
    request.getPoolList(this.state.currentPoolType).then(res => {
      this.updatePool(res.data);
      this.setState({
        pools: res.data,
        currentPool: res.data.length > 0 ? res.data[0].pool_name : ''
      }, () => {
        if(path.length > 1) {
          this.getSingle(path[1]);
        } else {
          this.getList();
        }
      });
    });
  }

  updatePool(pools) {
    let _config = this.state.config;
    let operations = [];
    pools.forEach(pool => {
      operations.push({
        name: pool.pool_name,
        value: pool.pool_name
      });
    });
    _config.operations[1].data = operations;
    _config.operations[1].value = operations[0] ? operations[0].value : null;

    if(this.state.currentPoolType === 'cloud') {
      _config.btns.forEach(btn => {
        if(btn.key !== 'refresh') {
          btn.disabled = true;
        }
      });
    } else {
      _config.btns.forEach(btn => {
        if(btn.key !== 'refresh') {
          btn.disabled = false;
        }
      });
    }

    this.setState({
      config: _config
    }, () => {
      delete _config.operations[1].value;
    });
  }

  getList() {
    this.clearState();
    let table = this.state.config.table;
    request.getList(this.state.currentPool, this.state.page).then(res => {
      table.data = res.data;
      // 分页,只需设计total即可
      table.total = res.count;
      this.updateTableData(table);
    }).catch(err => {
      table.data = [];
      this.updateTableData(table);
    });
  }

  getSingle(id) {
    this.clearState();
    let table = this.state.config.table;
    request.getListById(id).then(res => {
      table.data = [res];
      table.total = 1;
      this.updateTableData(table);
    }).catch(err => {
      table.data = [];
      table.total = 0;
      this.updateTableData(table);
    });
  }

  updateTableData(table) {
    let newConfig = this.state.config;

    newConfig.table.loading = false;
    newConfig.table = table;

    this.setState({
      config: newConfig
    });
  }

  onAction(field, actionType, data, refs) {
    switch(field) {
      case 'btnList':
        this.onClickBtnList(data.key, actionType, data);
        break;
      case 'operation':
        this.onClickOperationList(actionType, data.key, data);
        break;
      case 'detail':
        this.onClickDetailTabs(data.key, data, refs);
        break;
      case 'pagination':
        this.onClickPagination(data);
        break;
      case 'search':
        this.onSearchTable(data);
        break;
      default:
        break;
    }
  }

  // 操作operationList, operation list中有多种type
  onClickOperationList(operationType, key, data) {
    switch(operationType) {
      case 'select':
        this.onClickSelect(key, data);
        break;
      default:
        break;
    }
  }

  onClickSelect(key, data) {
    switch(key) {
      case 'type':
        this.loadingTable();
        this.setState({
          currentPoolType: data.value
        }, () => {
          this.onInitialize();
        });
        break;
      case 'pool':
        this.loadingTable();
        this.setState({
          currentPool: data.value
        }, () => {
          this.getList();
        });
        break;
      default:
        break;
    }
  }

  onClickPagination(data) {
    const { page } = data;
    this.loadingTable();
    this.setState({
      page: page
    }, this.getList);
  }

  onClickDetailTabs(tabKey, data, refs) {
    let contents = refs.state.contents;
    const {rows} = data;
    const properties = this.getProperties(rows[0]);
    switch(tabKey) {
      case 'description':
        refs.loading(true, () => {
          contents[tabKey] = (
            <Properties __={this.props.__} properties={properties} />
          );
          refs.setState({
            loading: false,
            contents: contents
          });
        });
        break;
      case 'snapshot':
        refs.loading(true, () => {
          const tableCfg = this.getDetailTableCfg(rows[0].snaps || []);
          contents[tabKey] = (
            <DetailTable table={tableCfg} __={this.props.__} />
          );
          refs.setState({
            loading: false,
            contents: contents
          });
        });
        break;
      default:
        break;
    }
  }

  getProperties(data) {
    const properties = [{
      title: 'name',
      content: data.name
    }, {
      title: 'capacity',
      content: data.size ? Math.ceil(unit.bytesToGB(data.size)) + 'GB' : '-'
    }, {
      title: 'parent_snapshot',
      content: data.parent ? data.parent.snapshot : '-',
      link: data.parent ? `/snapshot_mgmt/${data.parent.id}` : false
    }, {
      title: 'belong_pool',
      content: data.pool || '-'
    }, {
      title: 'snapshot_numbers',
      content: data.snaps && data.snaps.length
    }, {
      title: 'created_at',
      content: timeUtil(data.create_timestamp)
    }];
    return properties;
  }

  getDetailTableCfg(data) {
    const state = this.state;
    const __ = this.props.__;
    const table = {
      columns: [{
        title: __.name,
        dataIndex: 'snapshot',
        render: (text, row) => {
          return (
            <Link to={`/snapshot_mgmt/${row.id}`}>
              {row.name}
            </Link>
          );
        }
      }, {
        title: __.capacity,
        dataIndex: 'capacity',
        render: (text, row) => {
          return Math.ceil(unit.bytesToGB(row.size));
        }
      }, {
        title: __.created_at,
        key: 'created_at',
        render: (text, row) => {
          return timeUtil(row.timestamp);
        }
      }, {
        title: __.operation,
        key: 'operation',
        width: 180,
        render: (text, row) => {
          return <Button loading={state.detailTableBtnLoading[row.id]} type="danger" onClick={() => {
            this.setState({
              detailTableBtnLoading: {
                [row.id]: true
              }
            });
            request.getSnapshotById(row.id).then(res => {
              this.setState({
                detailTableBtnLoading: {
                  [row.id]: false
                }
              });
              deleteSnapshot(res, null, this.refresh);
            }).catch(err => {
              this.setState({
                detailTableBtnLoading: {
                  [row.id]: false
                }
              });
            });
          }}>
            {__.delete}
          </Button>;
        }
      }],
      data: data
    };

    return table;
  }

  loadingTable() {
    let _config = this.state.config;
    _config.table.loading = true;

    this.setState({
      config: _config
    });
  }

  clearState() {
    const dashboardRef = this.dashboard.current;
    if(dashboardRef) {
      dashboardRef.clearState();
    }
  }

  refresh() {
    this.loadingTable();
    this.getList();
  }

  onClickBtnList(key, actionType, data) {
    const { rows } = data;
    switch(key) {
      case 'create':
        create(this.state.pools, this.state.currentPool, this.refresh);
        break;
      case 'create_snapshot':
        createSnapshot(rows[0], this.refresh);
        break;
      case 'clear_snapshot':
        ModalAlert({
          __: this.props.__,
          title: ['clear_snapshot'],
          info: this.props.__.sure_to_clear_snapshot.replace('{0}', rows[0].name),
          message: this.props.__.sure_to_clear_snapshot_tip.replace('{0}', rows[0].name),
          btnValue: 'clear',
          onAction: (cb) => {
            request.clearSnapshot(rows[0].id).then(res => {
              cb(true);
              this.refresh();
            }).catch(err => {
              cb(false, getErrorMessage(err));
            });
          }
        });
        break;
      case 'flatten':
        ModalAlert({
          __: this.props.__,
          title: ['flatten'],
          info: this.props.__.sure_to_flatten_volume.replace('{0}', rows[0].name),
          btnValue: 'confirm',
          onAction: (cb) => {
            request.flatten(rows[0].id).then(res => {
              cb(true);
              this.refresh();
            }).catch(err => {
              cb(false, getErrorMessage(err));
            });
          }
        });
        break;
      case 'extend_capacity':
        changeSize(rows[0], this.refresh, true);
        break;
      case 'reduce_capacity':
        changeSize(rows[0], this.refresh, false);
        break;
      case 'rollback':
        rollback(rows[0], this.refresh);
        break;
      case 'delete':
        deleteModal(rows[0], this.refresh);
        break;
      case 'refresh':
        this.refresh();
        break;
      default:
        break;
    }
  }

  onSearchTable(data) {
    const { value } = data;
    this.loadingTable();
    if(value) {
      const pool = this.state.currentPool;
      const id = pool + '.' + value;
      this.getSingle(id);
    } else {
      this.getList();
    }
  }

  btnListRender(rows, btns) {
    for(let key in btns) {
      switch(key) {
        case 'create_snapshot':
        case 'extend_capacity':
        case 'reduce_capacity':
          btns[key].disabled = rows.length === 1 ? false : true;
          break;
        case 'flatten':
          btns[key].disabled = (rows.length === 1 && rows[0].parent) ? false : true;
          break;
        case 'clear_snapshot':
        case 'rollback':
          btns[key].disabled = (rows.length === 1 && rows[0].snaps && rows[0].snaps.length > 0) ? false : true;
          break;
        case 'delete':
          btns[key].disabled = rows.length === 1 ? false : true;
          break;
        default:
          break;
      }
    }
    return btns;
  }

  dashboard = React.createRef();

  render() {
    const state = this.state;
    const props = this.props;
    return (
      <div className="garen-module-volume">
        <Main
          ref={ this.dashboard }
          config={state.config}
          onAction={this.onAction}
          onInitialize={this.onInitialize}
          btnListRender={this.btnListRender}
          __={props.__}
        />
      </div>
    );
  }

}

export default Model;

