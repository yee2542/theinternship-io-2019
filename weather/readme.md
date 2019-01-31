# Weather

โปรแกรมแปลงไฟล์ xml เป็น json ซึ่งทำงานแบบ stream จึงรองรับการแปลงไฟล์ขนาดใหญ่

### Prerequisites

Node JS 11.7.0 หรือเทียบเท่า

format-json-stream : ^0.1.5

xml-to-json-stream : ^1.0.5

### Installing and Running

ในโฟลเดอร์มี package.json สามารถใช้ package manager จัดการได้


```
npm install
```

หากต้องการทดสอบตามโจทย์ สามารถใช้ package manager จัดการได้

```
npm start
```
หากต้องการเลือกไฟล์ที่ xml สามารถใช้คำสั่งดังต่อไปนี้
```
node index [source] [destination]
e.g. node index weather.xml weather.json
```

