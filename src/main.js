import Web3 from 'web3'
import { newKitFromWeb3 } from '@celo/contractkit'
import BigNumber from "bignumber.js"
import StudentReportAbi from '../contract/students.abi.json'
import erc20Abi from "../contract/erc20.abi.json"


let kit
let contract
let students = []

const ERC20_DECIMALS = 18
const StudentReportContractAddress = "0x22DdF809a6bf95819A915be7D1a10aC19Dc9519b"
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"


const connectCeloWallet = async function() {
  if (window.celo) {
    notification("⚠️ Please approve this DApp to use it.")
    try {
      await window.celo.enable()
      notificationOff()

      const web3 = new Web3(window.celo)
      kit = newKitFromWeb3(web3)

      const accounts = await kit.web3.eth.getAccounts()
      kit.defaultAccount = accounts[0]

      contract = new kit.web3.eth.Contract(StudentReportAbi, StudentReportContractAddress)

    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
  } else {
    notification("⚠️ Please install the CeloExtensionWallet.")
  }
}

const getBalance = async function() {
  notification("⌛ Loading...")
  const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
  const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
  document.querySelector("#balance").textContent = cUSDBalance
  notificationOff()
}

function notification(_text) {
  document.querySelector(".alert").style.display = "block"
  document.querySelector("#notification").textContent = _text
}

function notificationOff() {
  document.querySelector(".alert").style.display = "none"
}

const getResults = async function() {
  const _stuNum = await contract.methods.totalStudents().call()
  const _results = []

for (let i = 0; i < _stuNum; i++) {
    let _result = new Promise(async (resolve, reject) => {
      let p = await contract.methods.viewStudents(i).call()
      resolve({
        index: i,
        admin: p[0],
        name: p[1],
        regNum: p[2],
        department: p[3],
        level: p[4],
        summary: p[5],
        detail: p[6]
      })
    })
    _results.push(_result)
  }
  students = await Promise.all(_results)
  renderStu()
}

function resultTemplate(_result) {
  return `

      <td scope="row">${_result.index}</td>
      <td>${_result.name}</td>
      <td>${_result.regNum}</td>
      <td>${_result.department}</td>
      <td>${_result.level}</td>
      <td>${_result.summary}</td>
      <td><a data-toggle="modal" data-target="#detail-${_result.index}">Details</a></td>

      <!-- Modal -->
      <div class="modal fade" id="detail-${_result.index}" tabindex="-1" role="dialog" aria-labelledby="readLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="readLabel">${_result.regNum}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ${_result.detail}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
  `
}

function renderStu() {
  document.getElementById("sect").innerHTML = ""
  students.forEach((_result) => {
    const newDiv = document.createElement("tr")
    newDiv.innerHTML = resultTemplate(_result)
    document.getElementById("sect").appendChild(newDiv)
  })
}

// Create Post
document.querySelector("#addResultBtn").addEventListener("click", async (e) => {
    const params = [
      document.getElementById("stuName").value,
      document.getElementById("regNum").value,
      document.getElementById("stuDept").value,
      document.getElementById("stuLevel").value,
      document.getElementById("stuSum").value,
      document.getElementById("stuDet").value,
    ]
    notification(`⌛ Adding "${params[0]}"...`)


  try {
    await contract.methods.addStudent(...params).send({ from: kit.defaultAccount })
      notification(`🎉 You successfully added "${params[1]}".`)
      getResults()
  } catch (error) {
    notification(`⚠️ ${error}.`)
  }
  })

window.addEventListener('load', async () => {
  notification("⌛ Loading...")
  await connectCeloWallet()
  await getBalance()
  renderStu()
  getResults()
  editAddress(kit.defaultAccount)
  notificationOff()
});


function editAddress(_address){
  let address = document.querySelector(".addr")
  let add = _address
  add = add+'.'
  let str1 = add.slice(0,6);
  let str2 = add.slice(-5, -1);
  address.textContent = str1+'...'+str2
  address.style.display = 'flex'
  document.getElementById("blockchainlink").href=`https://alfajores-blockscout.celo-testnet.org/address/${kit.defaultAccount}/transactions`
}
