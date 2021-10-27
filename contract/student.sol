pragma solidity >=0.7.0 <0.9.0;
// SPDX-License-Identifier: GPL-3.0-or-later


contract StudentReport {
    uint internal numStudents = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    
    struct Student {
        address admin;
        string name;
        string regNum;
        string department;
        string level;
        string summary;
        string detail;
    }
    
    mapping (uint => Student) internal students;
    
    //Add Student Details
    function addStudent(
        string memory _name,
        string memory _regNum,
        string memory _department,
        string memory _level,
        string memory _summary,
        string memory _detail
    ) public {
        
        students[numStudents] = Student(
            msg.sender,
            _name,
            _regNum,
            _department,
            _level,
            _summary,
            _detail
        );
        numStudents++;
        }
     
    //Display Student Details 
    function viewStudents(uint _index) public view returns (
        address,
        string memory, 
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
            students[_index].summary,
            students[_index].detail
        );
    }
    
    //Get Student Count
    function totalStudents() public view returns (uint) {
        return (numStudents);
    }

}
