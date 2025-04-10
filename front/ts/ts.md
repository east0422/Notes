# typescript

### 简述
  - TypeScript是JavaScript的超集，可以编译成纯JavaScript。支持ES6语法，支持面向对象编程概念(如，类、接口、继承、泛型)。
  - 是一种静态类型检查的语言，在编译阶段就可以检查出数据类型的错误。

### 主要类型
  - boolean：布尔类型
  - number：数字类型，ts的数字类型都是浮点数，可支持二进制、八进制、十六进制
  - string：字符串类型，可用双引号""或单引号''表示，也可以使用模板字符串``进行包裹通过${}嵌入变量
  - array：数组类型，string[]或Array<string>两种常用方式
  - tuple：元组类型，允许表示一个已知元素数量和类型的数组，各元素类型不必相同，但赋值的类型位置个数需要和定义声明的保持一致
  - enum：枚举类型，常用于为一组数值赋予友好的别名
  - any：任意类型，不希望类型检测器对这些值进行类型检查而是直接让它们通过编译阶段的检查时使用
  - object：对象类型，非原始类型，常见的形式通过{}进行包裹
  - null和undefined：js中null表示'什么都没有'，是一个只有一个指的特殊类型，表示一个空对象引用；而undefined表示一个没有设置值的变量。默认情况下null和undefined是所有类型的子类型，就是说可以把null和undefined赋值给任何类型的变量。若ts配置了--strictNullChecks标记则null和undefined只能赋值给void和null/undefined
  - void：用于标识方法返回值的类型，表示该方法无返回值
  - never：never是其他类型(包括null和undefined)的子类型，可以赋值给任何类型，表示从不会出现的值。没有类型是never的子类型，所以never的变量只能被never类型所赋值。常用来指定那些总是会抛出异常、无限循环。 
  ```ts
  // tuple
  let tupleArr: [string, number] = ["hello", 10]
  // never
  let n1: never
  n1 = 123 // 错误写法
  n1 = (() => { throw new Error("error")})() // 正确写法
  // 返回never的函数必须存在无法达到的终点
  function error(message: string): never { throw new Error(message)}
  ```

### 高级类型
  - 交叉类型：用'&'表示，将多个类型合并为一个类型，包含了所有类型的成员，交叉类型要求最终类型必须同时满足所有被组合类型的约束，相当于类型的“与”操作；如果两个类型有同名但不同类型的属性会导致never类型，需要避免或解决这种冲突。
    ```ts
    /// 实用场景
    // 1. 声明一个函数将两个对象合并成一个对象并返回
    function mergeObj<T, U>(first: T, second: U): T & U {
      let result: <T & U> = {}
      for (let key in first) {
        result[key] = first[key]
      }
      for (let key in second) {
        if (!result.hasOwnProperty(key)) {
          result[key] = second[key]
        }
      }
      return result
    }
    // 2. 扩展第三方库类型
    declare module "lib" { // 原始类型
      interface Config {
        apiUrl: string;
      }
    }
    type CustomConfig = lib.Config & { // 扩展类型
      timeout: number;
    }
    const config: CustomConfig = {
      apiUrl: "http://api.xxx.com",
      timeout: 3000
    }

    /// 基础用法
    // 合并对象类型
    interface Person {
      name: string;
      age: number;
    }
    interface Employee {
      id: string;
      department: string;
    }
    type EmployeePerson = Person & Employee;
    const john: EmployeePerson = { // 合并后的类型必须同时包含两个接口的成员
      name: "John",
      age: 30,
      id: "E123",
      department: "IT"
    };
    // 合并函数类型
    type Loggable = {
      log: (msg: string) => void;
    };
    type Serializable = {
      serialize: () => string;
    };
    type LoggerSerializer = Loggable & Serializable;
    const util: LoggerSerializer = { // 合并后的类型必须同时实现log和serialize
      log: (msg) => console.log(msg),
      serialize: () => JSON.stringify({ data: "test" })
    };

    /// 高级用法
    // 与联合类型结合
    type A = { a: number };
    type B = { b: string };
    type C = { c: boolean };
    type Combined = (A | B) & C; // 等价于 (A & C) | (B & C)
    // 类型别名增强
    type WithTimestamp<T> = T & {
      timestamp: Date;
    };
    type Post = {
      title: string;
      content: string;
    };
    type DatedPost = WithTimestamp<Post>;
    const post: DatedPost = {
      title: "TS Tips",
      content: "...",
      timestamp: new Date()
    };

     /// 注意事项：
    // 1. 同名属性冲突： 如果被合并的类型存在同名但不同类型的属性，ts会推断为never类型
    type A = { prop: number };
    type B = { prop: string };
    type Conflict = A & B; // prop的类型为never(number & string不可同时满足)
    // 2. 与接口继承的区别：接口继承(extends)是显式声明层级关系，子接口继承父接口；交叉类型(&)是扁平合并类型，适用于无层级关系的类型组合
    // 3. 函数重载合并：合并函数类型时参数类型会被交叉
    type Func1 = (x: number) => void;
    type Func2 = (x: string) => void;
    type CombinedFunc = Func1 & Func2; // 实际类型：(x: number & string) => void(即x: never)
    ```
  - 联合类型：用'|'表示，表示其类型为连接的多个类型中的任意一个
    ```ts
    /// 核心特性
    // 1. 类型缩小：当使用联合类型时，通常需要结合类型检查(如typeof、instanceof或自定义类型守卫)来缩小类型范围，确保操作安全
    function printValue(value: string | number) { // value只能是string或number中的一个
      if (typeof value === "string") {
        console.log(value.toUpperCase()); // 此处value是string
      } else {
        console.log(value.toFixed(2));    // 此处value是number
      }
    }
    // 2. 公共属性和方法：如果联合类型的类型之间有公共属性或方法，可以直接访问
    interface Car {
      brand: string;
      drive(): void;
    }
    interface Bike {
      brand: string;
      ride(): void;
    }
    function getBrand(vehicle: Car | Bike) {
      console.log(vehicle.brand); // 合法：brand是公共属性
      vehicle.drive(); // 错误：drive不是Bike的成员
    }
    // 3. 联合类型与类型别名: 结合type关键字定义更清晰的联合类型
    type Result = "success" | "error" | 404 | 500;

    /// 常见场景
    // 1. 处理多种输入类型：处理多种输入类型
    function format(input: string | number) {
      return input.toString().toUpperCase();
    }
    // 2. 混合类型数组：数组元素可以是多种类型
    let mixedArray: (string | number)[] = ["apple", 42, "banana"];
    // 3. 可选的特定值：限制变量为有限的字面量集合
    let status = "active" | "inactive" | "pending";
    status = "active"; // 合法
    status = "deleted"; // 错误
     
    /// 基础用法
    let value: string | number;
    value = "hello"; // 合法
    value = 42;      // 合法
    value = true;    // 错误：只能是string或number

    /// 高级用法
    // 1. 联合类型与交叉类型结合：联合类型(|)表示'或'，交叉类型(&)表示'且'，可组合使用
    type A = { name: string };
    type B = { age: number };
    type C = A | B; // 可以是 A 或 B
    type D = A & B; // 必须同时有 name 和 age
    // 2. 可辨识联合(Discriminated Unions)：通过公共字面量属性(标签)区分联合成员，实现精确类型推断
    type Shape =
      | { kind: "circle"; radius: number }
      | { kind: "square"; size: number };
    function area(shape: Shape) {
      switch (shape.kind) {
        case "circle":
          return Math.PI * shape.radius ** 2; // 可安全访问radius
        case "square":
          return shape.size ** 2;            // 可安全访问size
      }
    }
    
    /// 注意事项
    // 1. 类型断言：必要时使用as明确类型，但需谨慎
    // 2. 穷尽性检查：使用never类型确保处理所有联合成员(结合switch或条件判断)
    ```
  - 类型别名：用来给一个类型起一个别名，可以作用于原始值、交叉类型、联合类型、元组等及其它任何需要手写的类型。
    ```ts
      /// 核心特性
      // 1. 类型别名可以是泛型，也可以使用类型别名来在属性里引用自己
      // 2. 可以使用type someName = someValidTypeAnnotation语法来创建类型别名

      /// 核心用法
      // 1. 基本类型别名(为简单类型创建别名)
      type UserID = number;  // 数字类型的别名
      type UserName = string; // 字符串类型的别名
      const id: UserID = 1001;
      const name: UserName = "Alice";
      // 2. 联合类型别名(合并多个类型)
      type Status = "active" | "inactive" | "pending"; // 字面量联合类型
      type ID = number | string; // 类型联合
      let userStatus: Status = "active";
      const userId: ID = "abc-123";
      const userAge: ID = 42;
      const isMale: ID = true; // 错误: ID只能是number或string
      // 3. 对象类型别名(定义复杂对象结构)
      type User = {
        id: number;
        name: string;
        age?: number; // 可选属性
      };
      const alice: User = { id: 1, name: "Alice" };
      // 4. 函数类型别名(描述函数签名)
      type AddFunction = (a: number, b: number) => number;
      const add: AddFunction = (x, y) => x + y;

      /// 高级技巧
      // 1. 泛型类型别名(结合泛型增加灵活性)
      type Response<T> = {
        code: number;
        data: T;
        message?: string;
      };
      const userRes: Response<User> = { code: 200, data: { id: 1, name: "Alice" } };
      // 2. 工具类型(复用内置工具类型)
      type PartialUser = Partial<User>; // 所有属性变为可选
      type ReadonlyUser = Readonly<User>; // 所有属性变为只读
      // 3. 条件类型(动态生成类型)
      type IsString<T> = T extends string ? true : false;
      type Result = IsString<"hello">; // true
      // 4. 映射类型(批量转换类型)
      type OptionalKeys<T> = {[K in keyof T]?: T[K];};
      type OptionalUser = OptionalKeys<User>; // 所有属性变为可选

      /// 类型别名(type)与接口(Interface)对比
      // 1. 类型别名不可直接扩展需用&交叉类型，接口可通过extends继承扩展
      // 2. 类型别名可以被重复声明(同一作用域内不可重复声明)，接口不可以(同名接口自动合并)
      // 3. 类型别名支持更复杂的类型运算(如条件类型等)，接口不支持类型运算
      // 4. 类型别名常用于联合类型、元组、函数类型等，接口常用于对象结构、类实现(implements)；定义对象结构，尤其是需要扩展或类实现时优先用接口；处理联合类型、元组、映射类型或需要类型运算的场景优先用类型别名

      /// 注意事项
      // 1. 避免循环引用：如果需要循环引用可以使用接口或类型别名。
      // 2. 类型别名不可被合并(同一作用域内重复声明类型别名会报错)
      type User = {
        id: number;
        name: string;
        age?: number;
      };
      type User = { id: number }; // 错误：重复声明
      // 3. 性能影响(过度复杂的类型别名可能导致类型检查变慢，尤其在大型项目中)

    ```
  - 类型索引：用于动态访问对象的属性或定义动态属性的类型
    ```ts
      /// 核心概念
      // 1. 索引签名：索引签名是一种定义对象动态属性的方式，允许使用字符串或数字作为键来访问对象的属性
      type Dictionary = {
        [key: string]: string; // 定义了一个字符串键的索引签名
      };
      const myDictionary: Dictionary = {
        "apple": "a fruit",
        "car": "a vehicle"
      };
      console.log(myDictionary["apple"]); // 输出: "a fruit"
      // 2. 索引访问类型(T[K]): 索引访问类型允许从对象类型中动态获取属性的类型。这种方式在处理动态属性时非常有用
      interface Person {
        name: string;
        age: number;
      }
      type NameType = Person["name"]; // string
      type AgeType = Person["age"]; // number
      // 3. 映射类型与索引签名：映射类型可以结合索引签名来创建复杂的类型
      // 使用keyof和T[K]创建一个自定义工具类型
      type User = {
        id: number;
        name: string;
        email: string;
      };
      type Optional<T> = {
        [K in keyof T]?: T[K]; // 将所有属性变为可选
      };
      // 这里通过索引签名和映射类型动态地将User的所有属性变为可选
      type OptionalUser = Optional<User>;
      // 等效于：
      // type OptionalUser = {
      //   id?: number | undefined;
      //   name?: string | undefined;
      //   email?: string | undefined;
      // }
      // 4. 索引签名的限制: 索引签名的键类型只能是string或number;如果对象有静态属性和动态属性，静态属性的类型必须与索引签名的类型兼容
      
      /// 应用场景
      // 1. 动态属性访问：在处理动态数据时，索引签名可以确保类型安全
      // 2. 映射类型：结合映射类型，可以动态生成复杂类型，如Partial、Readonly等
      // 3. 工具类型：通过索引签名和映射类型，可以创建自定义工具类型，提升代码的灵活性

    ```
  - 类型约束：用于确保类型的安全性和灵活性
    ```ts
      /// 核心概念
      // 1. 泛型约束: 泛型约束允许我们限制泛型参数的类型，确保其满足某些条件
      // 可以限制泛型类型必须包含特定的属性或方法
      function getLength<T extends { length: number }>(arg: T): number {
        return arg.length;
      }
      const stringLength = getLength("TypeScript"); // 正确，字符串有length属性
      const arrayLength = getLength([1, 2, 3]); // 正确，数组有length属性
      // getLength(42); // 错误，数字没有length属性
      // 2. 索引签名约束: 索引签名允许我们定义动态属性的类型，同时可以通过keyof或in关键字进一步约束键的类型
      type Statuses = "active" | "inactive" | "pending";
      interface StatusMap {
        [key in Statuses]: boolean;
      }
      const userStatus: StatusMap = {
        active: true,
        inactive: false,
        pending: true,
      };
      // userStatus.unknown = false; // 错误，键必须是"active"、"inactive"或"pending"
      // 3. 映射类型约束: 映射类型结合索引签名可以动态生成类型约束，确保类型的安全性
      type User = {
        id: number;
        name: string;
        email: string;
      };
      type Optional<T> = {
        [K in keyof T]?: T[K];
      };
      type OptionalUser = Optional<User>;
      // OptionalUser 是：
      // {
      //   id?: number | undefined;
      //   name?: string | undefined;
      //   email?: string | undefined;
      // }
      // 4. 条件类型约束: 条件类型允许根据条件选择不同的类型，进一步增强类型约束的灵活性
      type Check<T> = T extends string ? "yes" : "no";
      let a: Check<string>; // "yes"
      let b: Check<number>; // "no"
      // 5. 组合约束: 可以结合泛型、索引签名和映射类型，创建复杂的类型约束
      function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
        return obj[key];
      }
      const user = { id: 1, name: "Alice" };
      const userId = getProperty(user, "id"); // number
      const userName = getProperty(user, "name"); // string
      // getProperty(user, "age"); // 错误，"age"不是user的键
    ```
  - 映射类型：允许通过对现有类型的每个属性进行转换来创建新类型；
    ```ts
      /// 核心概念: 核心在于通过遍历源类型的所有属性，并根据某些规则对每个属性进行转换，从而生成新的类型

      /// 基本使用
      // 1. 只读类型：将对象的所有属性变为只读
      type Readonly<T> = {
        readonly [P in keyof T]: T[P];
      };
      interface Person {
        name: string;
        age: number;
      }
      const person: Readonly<Person> = { name: "Alice", age: 30 };
      // person.name = "Bob"; // 错误，属性是只读的
      // 2. 部分可选类型：将对象的所有属性变为可选
      type Partial<T> = {
        [P in keyof T]?: T[P];
      };
      interface User {
        id: number;
        name: string;
      }
      const user: Partial<User> = { name: "Alice" }; // 允许只提供部分属性 
      // 3. 记录类型: 创建一个对象类型，将所有键的类型映射到一个指定类型
      type Record<K extends string | number | symbol, T> = {
        [P in K]: T;
      };
      interface Person {
        name: string;
        age: number;
      }
      const personMap: Record<string, Person> = {};

      /// 高级使用
      // 1. 条件类型与映射类型结合: 可以创建仅包含特定类型属性的类型
      type OnlyStrings<T> = {
        [K in keyof T]: T[K] extends string ? T[K] : never;
      };
      interface User {
        name: string;
        age: number;
        email: string;
      }
      type StringProperties = OnlyStrings<User>;
      // 2. 属性重命名: 在映射过程中修改属性名
      type Getters<T> = {
        [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
      };
      interface User {
        id: number;
        name: string;
      }
      type UserGetters = Getters<User>;
      // 3. 过滤特定属性: 通过条件类型和never类型的结合，过滤掉不需要的属性
      type NonFunctionProps<T> = {
        [K in keyof T as T[K] extends Function ? never : K]: T[K];
      };
      interface Mixed {
        id: number;
        name: string;
        update(): void;
      }
      type DataProps = NonFunctionProps<Mixed>;

      /// 注意事项
      // 1. 映射类型只能在类型别名中使用，不能在接口中使用
      // 2.类型转换可能导致的不一致问题：在进行类型转换时，需要确保转换规则的正确性，否则可能导致类型不一致的问题
      // 3. 性能问题：在处理非常复杂的类型转换时，可能会对编译器性能产生一定影响

    ``` 
  - 条件类型：用来判断一个类型是否满足某些条件，比如判断一个类型是否是某个类型的子类型。
