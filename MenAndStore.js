
const makeStore = (initialStoreData) => {
    const store = new Map()
    initialStoreData.forEach(product => store.set(product.split(" ")[2], parseInt(product.split(" ")[0])))
    return store
}

const makeQueue = (initialMenData) =>
    initialMenData.map(man => ({ productName: man.split(" ")[2], requiredAmount: parseInt(man.split(" ")[0]) }))

const isProductEnough = (client, store) => store.get(client.productName) >= client.requiredAmount

const sellProduct = (client, store) => {
    const productRemainder = store.get(client.productName) - client.requiredAmount
    productRemainder ? store.set(client.productName, productRemainder) : store.delete(client.productName)
}

const makeCall = (client, queue) => {
    const tempClient = queue.shift()
    queue.unshift(client)
    queue.unshift(tempClient)
}

let counter = 0
const startSelling = (queue, store) => {
    if (queue.length === 0) {
        console.log(counter)
        return
    }
    const currentClient = queue.shift()
    if (store.has(currentClient.productName)) {
        counter++
        if (isProductEnough(currentClient, store)) {
            sellProduct(currentClient, store)
        } else {
            currentClient.requiredAmount = store.get(currentClient.productName)
            makeCall(currentClient, queue)
        }
    } else counter++
    startSelling(queue, store)
}

const initialStoreData = [
    "2 of sweets",
    "4 of milk",
    "1 of sausage"]

const initialMenData = [
    "2 of milk",
    "3 of sweets",
    "3 of milk",
    "1 of cheese"]

//Продукты, имеющиеся в магазине
const store = makeStore(initialStoreData)

//Очередь к прилавку. Каждый мужчина в очереди представлен виде объекта tiredMan:{productName:string, requiredAmount:number}
const queue = makeQueue(initialMenData)

startSelling(queue, store)