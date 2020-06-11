const tracer = require('tracer').colorConsole()
const console = tracer
const bitcoin = require('bsv')

//挖矿的尝试次数
const maxTried = 100000//Number.MAX_VALUE

//区块
class Block {
    constructor(data, previousHash, difficulty) {
        this.data = data.toString() //区块数据
        this.previousHash = previousHash //前一个区块的哈希值
        this.timestamp = Date.now().toString() //当前区块的时间戳
        this.difficulty = difficulty //难度
        this.mine() //挖矿，计算本区块的哈希值
    }

    //计算哈希值
    hash256() {
        const str = this.previousHash + this.data + this.timestamp + this.answer.toString()
        return bitcoin.crypto.Hash.sha256(Buffer.from(str, 'utf8')).toString('hex')
    }

    //挖矿
    mine() {
        //不断修改answer的值，计算区块哈希值，要求获取的哈希值前面必须有
        this.answer = -1
        do {
            this.answer++
            if(this.answer >= maxTried) {
                throw Error('No Answer')
            }
            this.hash = this.hash256()
        } while(this.hash.substr(0, this.difficulty) !== '0'.repeat(this.difficulty))
    }


}

//区块链
class Blockchain {
    constructor(genesis) {   
        //包含创世区块 
        this.chain = [genesis]
    }

    //检测区块是否有效，要求每一个新的区块都包含前一个区块的哈希值
    isValid() {
        //循环检测除创世区块之外的所有区块
        for(let i=1; i<this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previoudBlock = this.chain[i-1]
            //计算当前区块的哈希值是否正确地被计算
            if(currentBlock.hash != currentBlock.hash256()) {
                console.debug(currentBlock.hash, currentBlock.hash256())
                return false
            }
            //前一个区块的哈希值应该等于当前区块保存的值
            if(previoudBlock.hash != currentBlock.previousHash) {
                console.debug(previoudBlock.hash, currentBlock.previousHash)
                return false
            }
            //当前区块的哈希值符合难度要求
            if(currentBlock.hash.substr(0, currentBlock.difficulty) !== '0'.repeat(currentBlock.difficulty)) {
                console.debug(currentBlock.hash.substr(0, currentBlock.difficulty) , '0'.repeat(currentBlock.difficulty))
                return false
            }
        }
        return true
    }

    //添加一个新的区块
    append(data, difficulty) {
        const newBlock = new Block(data, this.chain[this.chain.length-1].hash, difficulty)
        this.chain.push(newBlock)
    }

}

//创世区块, 前一个区块的哈希值设为0， 难度为0，也就是不需要有0
const genesisBlock = new Block('Born', 0, 0)
//创建区块链
const blockchain = new Blockchain(genesisBlock)
//不断追加新的区块，难度不断增加
blockchain.append('Love', 1)
blockchain.append('Marry', 2)
blockchain.append('Life', 3)
blockchain.append('How to change your wife(life) in 21 days', 4)
//输出所有的区块
console.log(blockchain.chain)
//检查区块链的有效性
console.log(blockchain.isValid())