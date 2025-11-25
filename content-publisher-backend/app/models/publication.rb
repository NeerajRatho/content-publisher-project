class Publication < ApplicationRecord
  belongs_to :user

  validates :title, presence: true,  length: { minimum: 3 }
  validates :content, presence: true
  validates :status, inclusion: { in: %w[draft published archived] }
end
