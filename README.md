多国语言使用的react-intl 
tanslations目录中为配置文件 ，数据类型为json

使用：
1.引入react-intl  import { FormattedMessage,FormattedDate ,FormattedNumber} from 'react-intl'; 
2.
日期时间
a. <FormattedDate /> 用于格式化日期，能够将一个时间戳格式化成不同语言中的日期格式。

传入时间戳作为参数：

<FormattedDate 
    value={new Date(1459832991883)}
/>
输出结果：

<span>4/5/2016</span>
b. <FormattedTime> 用于格式化时间，效果与<FormattedDate />相似。

传入时间戳作为参数：

<FormattedTime 
   value={new Date(1459832991883)}
/>
输出结果：

<span>1:09 AM</span>
c. <FormattedRelative /> 通过这个组件可以显示传入组件的某个时间戳和当前时间的关系，比如 “ 10 minutes ago"。

传入时间戳作为参数：

<FormattedRelative 
    value={Date.now()}
/>
输出结果:

<span>now</span>
10秒之后的输出结果：

<span>10 seconds ago</span>
1分钟之后的输出结果：

<span>1 minute ago</span>
数字量词
a. <FormattedNumber /> 这个组件最主要的用途是用来给一串数字标逗号，比如10000这个数字，在中文的语言环境中应该是1,0000，是每隔4位加一个逗号，而在英语的环境中是10,000，每隔3位加一个逗号。

传入数字作为参数：

<FormattedNumber 
    value={1000}
/>
输出结果：

<span>1,000</span>
b. <FormattedPlural /> 这个组件可用于格式化量词，在中文的语境中，其实不太会用得到，比如我们说一个鸡腿，那么量词就是‘个’，我们说两个鸡腿，量词还是‘个’，不会发生变化。但是在英文的语言环境中，描述一个苹果的时候，量词是apple，当苹果数量为两个时，就会变成apples，这个组件的作用就在于此。

传入组件的参数中，value为数量，其他的为不同数量时对应的量词，在下面的例子中，一个的时候量词为message，两个的时候量词为messages。实际上可以传入组件的量词包括 zero, one, two, few, many, other 已经涵盖了所有的情况。

<FormattedPlural
    value={10}
    one='message'
    other='messages'/>
传入组件的量词参数可以是一个字符串，也可以是一个组件，我们可以选择传入<FormattedMessage />组件，就可以实现量词的不同语言的切换。

输出结果：

<span>messages</span>
字符串的格式化
a. <FormattedMessage /> 这个组件用于格式化字符串，是所有的组件中使用频率最高的组件，因为基本上，UI上面的每一个字符串都应该用这个组件替代。这个组件的功能丰富，除了可以根据配置输出不同语言的简单字符串之外，还可以输出包含动态变化的参数的复杂字符串，具体的用法在后面的例子中会慢慢叙述。

比如我们在locale配置文件中写了如下内容：

const app = {
    greeting:'Hello Howard!",
}

export default app;
使用这个组件的时候，我们这么写：

<FormattedMessage
    id='app.greeting'
    description='say hello to Howard'
    defaultMessage='Hello, Howard!'
    />
id指代的是这个字符串在locale配置文件中的属性名，description指的是对于这个位置替代的字符串的描述，便于维护代码，不写的话也不会影响输出的结果，当在locale配置文件中没有找到这个id的时候，输出的结果就是defaultMessage的值。

输出的结果：

<span>Hello, Howard!</span>
b. <FormattedHTMLMessage /> 这个组件的用法和<FormattedMessage />完全相同，唯一的不同就是输出的字符串可以包含HTML标签，但是官方不太推荐使用这个方法，如果可以想办法用<FormattedMessage />的话，就不应该使用这个组件，我揣测应该是性能方面不如<FormattedMessage />，这个组件的用法我就不举例了。