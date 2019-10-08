import {types, IAnyType, SnapshotOrInstance, Instance, destroy} from 'mobx-state-tree'
import dayjs, {Dayjs} from 'dayjs'
import {moveItem} from './move-item'
import {v4} from 'uuid'

export const date = types.custom<string | number, Dayjs>({
  name: 'CustomDate',
  fromSnapshot(value: string | number): Dayjs {
    return dayjs(value.toString())
  },
  toSnapshot(value: Dayjs): string {
    return value.toISOString()
  },
  isTargetType(value: string | number | Dayjs): boolean {
    return dayjs.isDayjs(value)
  },
  getValidationMessage(value: string): string {
    return !isNaN(Date.parse(value)) ? '' : `${value} doesn't look like a date`
  }
})

export const identifierUuid = types.optional(types.identifier, () => v4())

export function collection<T extends IAnyType>(model: T, name: string) {
  const base = types
    .model(name, {
      /**
       * Collection elements.
       */
      items: types.array(model)
    })
    .views(self => ({
      /**
       * Get all collection items.
       */
      all() {
        return self.items
      },
      /**
       * Check if collection is empty.
       */
      isEmpty() {
        return self.items.length === 0
      },
      /**
       * Check if collection is not empty.
       */
      isNotEmpty() {
        return self.items.length !== 0
      },
      /**
       * Get items identifiers.
       */
      keys(): Array<number | string> {
        return self.items.map(item => item.id)
      },
      /**
       * Check if collection contains item with given id.
       */
      has(id?: number | string, key: string = 'id') {
        return self.items.some(item => item[key] === id)
      },
      /**
       * Find item by id.
       * @example
       * store.users.get(2)
       */
      get(id: number | string, key: keyof Instance<T> = 'id') {
        return self.items.find(item => item[key] === id)
      },
      /**
       * Get first element of collection.
       */
      first(): Instance<T> | null {
        return self.items.length ? self.items[0] : null
      },
      /**
       * Get last element of collection.
       */
      last(): Instance<T> | null {
        return self.items.length ? self.items[self.items.length - 1] : null
      },
      /**
       * Get the total number of items in the collection.
       */
      count(): number {
        return self.items.length
      },
      /**
       * Get the number of items that match the filter check.
       *
       * @example
       * // Count all items
       * store.posts.countBy()
       * // Count items by author id
       * store.posts.countBy(item => item.author.id === 1)
       */
      countBy(filter: (item: Instance<T>) => any): number {
        if (typeof filter === 'function') {
          return self.items.filter(filter).length
        }

        return self.items.length
      },
      /**
       * Get a console.log of items.
       * @example
       * store.users.dump()
       */
      dump() {
        console.log(self.items.toJSON().map(item => item.toJSON()))
      },
      /**
       * Calls a defined callback function on each element of an array, and returns an array that contains the results.
       */
      map<U>(callbackfn: (value: Instance<T>, index: number, array: Instance<T>[]) => U, thisArg?: any) {
        return self.items.map(callbackfn, thisArg)
      },
      /**
       * Performs the specified action for each element in an array.
       */
      forEach(callbackfn: (value: Instance<T>, index: number, array: Instance<T>[]) => void, thisArg?: any) {
        return self.items.forEach(callbackfn, thisArg)
      }
    }))
    .actions(self => ({
      /**
       * Remove all items.
       * @example
       * store.users.clear()
       */
      clear() {
        self.items.replace([])
      },
      /**
       * Replace collection items with given items.
       * store.users.replace([{id: 1, username: 'john'}])
       */
      replace(items: SnapshotOrInstance<T>[]) {
        self.items.replace(items)
      },
      /**
       * Add single or multiple items to collection.
       * @example
       * store.posts.add({id: 1, title: 'Hello'})
       * store.posts.add([
       *   {id: 1, title: 'Hello'},
       *   {id: 2, title: 'World'},
       * ])
       */
      add(model: SnapshotOrInstance<T> | SnapshotOrInstance<T>[]) {
        if (Array.isArray(model)) {
          self.items.push(...model)
        } else {
          self.items.push(model)
        }

        return self.items.slice(-1)[0]
      },
      /**
       * Remove item by passing model, array of models or id.
       * @example
       * store.users.remove(user)
       * store.users.remove([me, otherUser])
       * store.users.remove(1)
       * store.users.remove([1, 2])
       */
      remove(
        model: SnapshotOrInstance<T> | SnapshotOrInstance<T>[] | number | number[],
        key: keyof Instance<T> = 'id'
      ) {
        const removeByModelOrByNumber = (idOrModel: number | SnapshotOrInstance<T>) => {
          if (typeof idOrModel === 'number') {
            const itemInCollection = self.items.find(item => item[key] === idOrModel)
            if (itemInCollection) destroy(itemInCollection)
          } else {
            destroy(idOrModel)
          }
        }

        if (Array.isArray(model)) {
          model.forEach(removeByModelOrByNumber)
        } else {
          removeByModelOrByNumber(model)
        }
      },
      /**
       * Moves an item from one position to another, checking that the indexes given are within bounds.
       * @example
       * store.posts.move(1, 2)
       */
      move(fromIndex: number, toIndex: number) {
        moveItem(self.items, fromIndex, toIndex)
      }
    }))
    .actions(self => ({
      /**
       * Load data from given request and inject it into items
       * @example
       * store.posts.load(endpoints.posts.list, {author: 1})
       */
      load: async function<Args>(request: (args: Args) => Promise<SnapshotOrInstance<T>[]>, args: Args) {
        return request(args).then(self.replace)
      }
    }))
  return types.optional(base, {items: []})
}
