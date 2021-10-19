pragma solidity >=0.7.0 <0.9.0;
// SPDX-License-Identifier: GPL-3.0-or-later

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract StudentReport {
    uint internal numStudents;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Student {
        address admin;
        string name;
        string regNum;
        string department;
        string level;
        string summary;
    }

    mapping (string => Student) internal students;

    function addStudent(
        string memory _name,
        string memory _regNum,
        string memory _department,
        string memory _level,
        string memory _summary
    ) public {

        students[_regNum] = Student(
            msg.sender,
            _name,
            _regNum,
            _department,
            _level,
            _summary
        );
        numStudents++;
        }

    function viewStudents(string memory _index) public view returns (
        address,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory

    ) {
        return (
            students[_index].admin,
            students[_index].name,
            students[_index].regNum,
            students[_index].department,
            students[_index].level,
            students[_index].summary
        );
    }

    function totalStudents() public view returns (uint) {
        return (numStudents);
    }

}
