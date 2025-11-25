class PublicationsController < ApplicationController
  before_action :set_publication, only: [:show, :update]

  def index
    @publications = @current_user.publications

    if params[:search].present?
      @publications = @publications.where("LOWER(title) LIKE ?", "%#{params[:search].downcase}%")
    end

    render json: { publications: @publications, message: 'Publications fetched successfully' }, status: :ok
  rescue => e
    render json: { error: 'Failed to fetch publications', details: e.message }, status: :internal_server_error
  end

  def create
    @publication = @current_user.publications.build(publication_params)
    if @publication.save
      render json: { publication: @publication, message: 'Publication created successfully' }, status: :created
    else
      render json: { errors: @publication.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActionController::ParameterMissing => e
    render json: { error: 'Missing parameters', details: e.message }, status: :bad_request
  rescue => e
    render json: { error: 'Failed to create publication', details: e.message }, status: :internal_server_error
  end

  def show
    render json: { publication: @publication, message: 'Publication fetched successfully' }, status: :ok
  end

  def update
    if @publication.update(publication_params)
      render json: { publication: @publication, message: 'Publication updated successfully' }, status: :ok
    else
      render json: { errors: @publication.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActionController::ParameterMissing => e
    render json: { error: 'Missing parameters', details: e.message }, status: :bad_request
  rescue => e
    render json: { error: 'Failed to update publication', details: e.message }, status: :internal_server_error
  end


  def destroy
    ids = params[:ids] || [params[:id]]  
    publications = Publication.where(id: ids)

    if publications.empty?
      render json: { error: 'No publications found for deletion' }, status: :not_found
      return
    end

    if publications.destroy_all
      render json: { message: 'Publications permanently deleted successfully' }, status: :ok
    else
      render json: { error: 'Failed to delete publications' }, status: :internal_server_error
    end
  end

  private

  def set_publication
    @publication = @current_user.publications.find_by(id: params[:id])
    return render json: { error: 'Publication not found' }, status: :not_found unless @publication
  end

  def publication_params
    params.require(:publication).permit(:title, :content, :status)
  end
end
