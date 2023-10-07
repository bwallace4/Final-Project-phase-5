"""first revison

Revision ID: 31aabbf7afc5
Revises: f33b9ee79a19
Create Date: 2023-10-07 07:15:28.711355

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '31aabbf7afc5'
down_revision = 'f33b9ee79a19'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('employee',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('level', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('manager',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('department', sa.String(length=50), nullable=True),
    sa.Column('title', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('_password_hash', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('task',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('due_date', sa.Date(), nullable=True),
    sa.Column('completed', sa.Boolean(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name=op.f('fk_task_user_id_user')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_employee_association',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('employee_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['employee_id'], ['employee.id'], name=op.f('fk_user_employee_association_employee_id_employee')),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name=op.f('fk_user_employee_association_user_id_user'))
    )
    op.create_table('user_task_association',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('task_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['task_id'], ['task.id'], name=op.f('fk_user_task_association_task_id_task')),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name=op.f('fk_user_task_association_user_id_user'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_task_association')
    op.drop_table('user_employee_association')
    op.drop_table('task')
    op.drop_table('user')
    op.drop_table('manager')
    op.drop_table('employee')
    # ### end Alembic commands ###