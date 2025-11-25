FactoryBot.define do
  factory :publication do
    title { "MyString" }
    content { "MyText" }
    status { "MyString" }
    user { nil }
  end
end
