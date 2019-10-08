import * as React from 'react'
import {observer} from 'mobx-react-lite'
import {ContextState, Context} from '../../models'
import {FormState} from '@smashing/form'
import {NavigatorItem} from './navigator-item'
import cx from 'classnames'
import './navigator.scss'

const ContextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" viewBox="0 0 576 512">
    <g fill="currentColor">
      <path d="M527.95 224H480v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h385.057c28.068 0 54.135-14.733 68.599-38.84l67.453-112.464C588.24 264.812 565.285 224 527.95 224zM48 96h146.745l64 64H432c8.837 0 16 7.163 16 16v48H171.177c-28.068 0-54.135 14.733-68.599 38.84L32 380.47V112c0-8.837 7.163-16 16-16zm493.695 184.232l-67.479 112.464A47.997 47.997 0 0 1 433.057 416H44.823l82.017-136.696A48 48 0 0 1 168 256h359.975c12.437 0 20.119 13.568 13.72 24.232z"></path>
    </g>
  </svg>
)

export interface NavigatorProps {
  contexts: Context[]
  className?: string
  form: FormState<any>
  contextFilter?: (item: Context) => boolean
  contextStatesModifier?: (items: ContextState[], context: Context) => ContextState[]
  renderEmptyState?: React.FC
  stateFilter?: (item: ContextState) => boolean
  renderStateItemMeta: (item: ContextState) => React.ReactNode
}

const Navigator = observer<NavigatorProps>(
  ({
    contexts,
    form,
    renderStateItemMeta,
    renderEmptyState: EmptyState = () => <div />,
    className,
    contextFilter = () => true,
    stateFilter = () => true
  }) => {
    const [selectedNodeId, setSelectedNodeId] = React.useState()

    if (contexts.filter(contextFilter).filter(item => item.statesWithDraft.filter(stateFilter).length).length === 0) {
      return <EmptyState />
    }

    return (
      <div className={cx('navigator', className)}>
        {contexts
          .filter(contextFilter)
          .filter(item => item.statesWithDraft.filter(stateFilter).length && item.name)
          .map(item => (
            <React.Fragment key={item.uuid}>
              <div className="navigator__item" key={item.uuid}>
                {/* Context name */}
                <ContextIcon /> <span>{item.name}</span>
              </div>
              {item.statesWithDraft.filter(stateFilter).length > 0 && (
                <div className="navigator navigator--sub">
                  {item.statesWithDraft
                    .filter(stateFilter)
                    .filter(item =>
                      form.values.statusFilter === 'all' ? true : item.status === form.values.statusFilter
                    )
                    .filter(item => item.name)
                    .map(item => (
                      <NavigatorItem
                        key={item.uuid}
                        renderItemMeta={renderStateItemMeta}
                        item={item}
                        selectedNodeId={selectedNodeId}
                        setSelectedNodeId={setSelectedNodeId}
                      />
                    ))}
                </div>
              )}
            </React.Fragment>
          ))}
      </div>
    )
  }
)

export default Navigator
