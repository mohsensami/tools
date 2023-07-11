import { useState } from "react";

const Index = () => {
  const [lorem, setLorem] = useState(
    "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد."
  );
  const handleCopy = () => {
    navigator.clipboard.writeText(lorem);
  };
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-center my-8">لورم ایپسوم</h1>
      <div className="flex flex-col justify-center items-center">
        <textarea className="w-full h-96 p-4 border border-gray-300 focus:border-0">
          {lorem}
        </textarea>
        <div>
          <button
            onClick={handleCopy}
            className="bg-indigo-400 text-white w-40 h-8 mt-2"
          >
            {/* {navigator.clipboard.writeText(lorem) ? "xxxx" : "aaa"} */}
            کپی
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
